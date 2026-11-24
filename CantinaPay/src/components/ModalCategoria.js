import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

const IMAGENS_CATEGORIA = {
'Bebidas': require('../assets/Category/Bebidas.jpg'),
'Bomboniere': require('../assets/Category/Bomboniere.jpg'),
'Fit': require('../assets/Category/Fit.jpg'),
'Salgadinhos': require('../assets/Category/Salgadinhos.jpg'),
'Salgados': require('../assets/Category/Salgados.jpg'),
'Sobremesa': require('../assets/Category/Sobremesa.jpg'),
'Veganos': require('../assets/Category/Veganos.jpg'),
};
const chavesImagens = Object.keys(IMAGENS_CATEGORIA);

export default function ModalCategoria({ visible, onClose, onSuccess, categorias, produtos }) {
  const [tab, setTab] = useState('criar'); 
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  
  const iconesIniciais = ['coffee', 'shopping-bag', 'gift', 'star', 'heart', 'droplet', 'box'];
  const [iconeSelecionado, setIconeSelecionado] = useState(chavesImagens[0]);
  const [isIconeCustomizado, setIsIconeCustomizado] = useState(false);
  
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [produtoVinculado, setProdutoVinculado] = useState(null);



  const pickImage = async () => {
    // 1. Pede a permissão para o usuário primeiro!
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso à sua galeria para escolher uma foto.');
      return; // Se não der permissão, para o código aqui
    }

    // 2. Se deu permissão, abre a galeria
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // No ModalProduto pode usar [3, 4] se preferir a foto mais retangular
      quality: 1,
    });

    if (!result.canceled) {
      // Se for no ModalCategoria:
      setIconeSelecionado(result.assets[0].uri);
      setIsIconeCustomizado(true);
      
      // Se for no ModalProduto, o estado chama setImagemSelecionada:
      // setImagemSelecionada(result.assets[0].uri);
    }
  };

  async function handleSalvar() {
    if (!nome) {
      Alert.alert('Atenção', 'Preencha o nome da categoria.');
      return;
    }

    setLoading(true);
    try {
      // CRIANDO O PACOTE FORMDATA PARA ENVIAR ARQUIVOS
      const formData = new FormData();
      formData.append('nome', nome);

      // Verificando se a pessoa escolheu uma foto física da galeria
      if (isIconeCustomizado && iconeSelecionado) {
        const localUri = iconeSelecionado;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('icone', {
          uri: localUri,
          name: filename,
          type,
        });
      } else {
        // Se for só o nome do ícone (ex: 'Bebidas'), envia como texto normal
        formData.append('icone', iconeSelecionado);
      }

      // CONFIGURAÇÃO DO CABEÇALHO PARA ARQUIVOS
      const configReq = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (tab === 'criar') {
        // Enviando o formData em vez de { nome, icone }
        await api.post('/categorias', formData, configReq);
        Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      } else {
        if (!categoriaEdit) {
          Alert.alert('Atenção', 'Selecione uma categoria para editar.');
          setLoading(false);
          return;
        }
        await api.put(`/categorias/${categoriaEdit.id}`, formData, configReq);
        
        if (produtoVinculado) {
          await api.patch(`/produtos/${produtoVinculado.id}/vincular-categoria`, {
            categoriaId: categoriaEdit.id
          });
        }
        Alert.alert('Sucesso', 'Categoria editada!');
      }
      
      if (onSuccess) onSuccess(); 
      
      setNome('');
      setCategoriaEdit(null);
      setProdutoVinculado(null);
      onClose(); 
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar a categoria.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalClickableArea} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>

          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Feather name="arrow-left" size={24} color="#ea580c" />
            </TouchableOpacity>
            <Text style={styles.modalMainTitle}>Categoria</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => { setTab('criar'); setCategoriaEdit(null); setNome(''); }}>
              <Text style={[styles.tabText, tab === 'criar' && styles.tabTextActive]}>Criar Nova</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('editar')}>
              <Text style={[styles.tabText, tab === 'editar' && styles.tabTextActive]}>Editar</Text>
            </TouchableOpacity>
          </View>

          {tab === 'editar' && (
            <View style={styles.editSelectionContainer}>
              <Text style={styles.sectionLabel}>Selecione a Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                {categorias?.map((cat) => (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={[styles.catEditCard, categoriaEdit?.id === cat.id && styles.iconCardActive]}
                    onPress={() => {
                      setCategoriaEdit(cat);
                      setNome(cat.nome);
                      setIconeSelecionado(cat.icone || iconesIniciais[0]);
                      setIsIconeCustomizado(cat.icone?.includes('file:') || cat.icone?.includes('http'));
                    }}
                  >
                    <View style={styles.catIconCircleMini}>
                      {cat.icone?.includes('file:') || cat.icone?.includes('http') ? (
                        <Image source={{ uri: cat.icone }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                      ) : IMAGENS_CATEGORIA[cat.icone] ? (
                        <Image source={IMAGENS_CATEGORIA[cat.icone]} style={{ width: 30, height: 30, borderRadius: 15 }} />
                      ) : (
                        <Feather name={cat.icone || 'box'} size={20} color="#ea580c" />
                      )}
                    </View>
                    <Text style={styles.catCardText} numberOfLines={1}>{cat.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {categoriaEdit && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: 15 }]}>Vincular a um Produto</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                    {produtos?.map((prod) => (
                      <TouchableOpacity 
                        key={prod.id} 
                        style={[styles.catEditCard, produtoVinculado?.id === prod.id && styles.iconCardActive]}
                        onPress={() => setProdutoVinculado(prod)}
                      >
                        <Image source={{ uri: prod.imagem || 'https://placehold.co/74x107' }} style={{ width: 40, height: 40, borderRadius: 5, marginBottom: 5 }} />
                        <Text style={styles.catCardText} numberOfLines={1}>{prod.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
          )}

          <Text style={styles.modalSubtitle}>
            {tab === 'criar' ? 'Ícone da Categoria' : 'Mudar Ícone'}
          </Text>

          {/* Container wrapper que impede o scroll view de vazar para a lateral */}
          <View style={styles.scrollWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              <TouchableOpacity style={styles.imageCardBtn} onPress={pickImage}>
                <Feather name="camera" size={30} color="#ea580c" />
                <Text style={styles.imageCardBtnText}>Galeria</Text>
              </TouchableOpacity>

              {chavesImagens.map((chave, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.iconCard, (iconeSelecionado === chave && !isIconeCustomizado) && styles.iconCardActive]}
                  onPress={() => { setIconeSelecionado(chave); setIsIconeCustomizado(false); }}
                >
                  {/* Se a imagem for local, carregamos do nosso dicionário */}
                  <Image source={IMAGENS_CATEGORIA[chave]} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                </TouchableOpacity>
              ))}

              {isIconeCustomizado && iconeSelecionado && (
                <TouchableOpacity style={[styles.iconCard, styles.iconCardActive]}>
                  <Image source={{ uri: iconeSelecionado }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Nome da Categoria" 
              placeholderTextColor="#ea580c"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleSalvar} disabled={loading}>
            {loading ? <ActivityIndicator color="#ea580c" /> : <Text style={styles.confirmButtonText}>Confirmar</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    left: '10%' 

  },
  modalClickableArea: { 
    flex: 1 

  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 100, 
    position: 'relative' 

  },
  backButton: { 
    position: 'absolute', 
    top: 22, 
    right: '100%', 
    width: 50, 
    height: 40, 
    backgroundColor: '#fafaf9', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 

  },
  modalContent: { 
    height: '104%', 
    width: '90%', 
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100, 
    alignItems: 'center', 
    paddingTop: 30 

  },
  modalMainTitle: { 
    color: '#ffffff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20 ,
    marginLeft: 20
  },
  tabContainer: { 
    flexDirection: 'row', 
    width: '80%', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#fcd34d', 
    paddingBottom: 10, 
    marginBottom: 20 

  },
  tabText: { 
    color: '#ffffff', 
    fontSize: 20, 
    fontWeight: '500', 
    opacity: 0.6 

  },
  tabTextActive: { 
    fontWeight: 'bold', 
    opacity: 1 

  },
  modalSubtitle: { 
    color: '#ffffff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    alignSelf: 'flex-start', 
    paddingLeft: '10%' 

  },
  sectionLabel: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    alignSelf: 'flex-start', 
    paddingLeft: '10%', 
    marginBottom: 10 

  },
  editSelectionContainer: { 
    width: '100%', 
    marginBottom: 20 

  },
  scrollWrapper: { 
    width: '100%', 
    paddingLeft: '10%' 

  }, 
  scrollContent: { 
    paddingRight: 40, 
    alignItems: 'center' 

  },
  iconScroll: { 
    maxHeight: 120, 
    paddingLeft: '10%' 

  },
  catEditCard: { 
    width: 70, 
    height: 90, 
    borderRadius: 10, 
    marginRight: 15, 
    backgroundColor: '#fef3c7', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 5 

  },
  catIconCircleMini: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 5 

  },
  catCardText: { 
    fontSize: 10, 
    color: '#333', 
    textAlign: 'center' 

  },
  imageCardBtn: { 
    width: 80, 
    height: 90, 
    borderRadius: 20, 
    backgroundColor: '#fef3c7', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15, 
    borderWidth: 1, 
    borderColor: '#fcd34d' 
  },
  imageCardBtnText: { 
    fontSize: 12, 
    color: '#ea580c', 
    marginTop: 5, 
    fontWeight: 'bold' 
  },
  iconCard: { 
    width: 80, 
    height: 90, 
    backgroundColor: '#fef3c7', 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  iconCardActive: { 
    borderWidth: 5, 
    borderColor: '#000' 
  },
  inputWrapper: { 
    width: '80%', 
    marginTop: 25 

  },
  modalInput: { 
    backgroundColor: '#fef3c7', 
    height: 45, 
    borderRadius: 5, 
    paddingHorizontal: 20, 
    fontSize: 16, 
    color: '#ea580c' 

  },
  confirmButton: { 
    backgroundColor: '#fcd34d', 
    width: 150, 
    height: 45, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 'auto', 
    marginBottom: '30%', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 4 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },
  confirmButtonText: { 
    color: '#ea580c', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
});
