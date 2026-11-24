import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

export default function ModalProduto({ visible, onClose, onSuccess, produtos, categorias }) {
  const [tab, setTab] = useState('criar');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  
  const imagens = [
    'https://placehold.co/74x107', 
    'https://placehold.co/74x107/png', 
    'https://placehold.co/74x107/orange'
    // Exemplo de como puxar da sua pasta assets futuramente:
    // require('../assets/Products/Produto1.jpg'),
    // require('../assets/Products/Produto2.jpg'),
  ];
  const [imagemSelecionada, setImagemSelecionada] = useState(imagens[0]);
  const [produtoEdit, setProdutoEdit] = useState(null);
  
  // Novo estado para controlar a categoria selecionada
  const [categoriaVinculada, setCategoriaVinculada] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso à sua galeria para escolher uma foto.');
      return; 
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4], 
      quality: 1,
    });

    if (!result.canceled) {
      setImagemSelecionada(result.assets[0].uri);
    }
  };

  async function handleSalvar() {
    if (!nome || !valor || !categoriaVinculada) {
      Alert.alert('Atenção', 'Preencha o nome, o valor e selecione uma categoria.');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'criar') {
        await api.post('/produtos', {
          nome,
          preco: Number(valor.replace(',', '.')),
          imagem: imagemSelecionada,
          categoriaId: categoriaVinculada // Enviando a categoria
        });
        Alert.alert('Sucesso', 'Produto criado com sucesso!');
      } else {
        if (!produtoEdit) {
          Alert.alert('Atenção', 'Selecione um produto para editar.');
          setLoading(false);
          return;
        }
        await api.put(`/produtos/${produtoEdit.id}`, {
          nome,
          preco: Number(valor.replace(',', '.')),
          imagem: imagemSelecionada,
          categoriaId: categoriaVinculada // Editando a categoria
        });
        Alert.alert('Sucesso', 'Produto editado com sucesso!');
      }
      
      if (onSuccess) onSuccess(); 
      
      setNome('');
      setValor('');
      setProdutoEdit(null);
      setCategoriaVinculada(null);
      onClose(); 
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar o produto.');
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
            <Text style={styles.modalMainTitle}>Produto</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => { setTab('criar'); setProdutoEdit(null); setNome(''); setValor(''); setCategoriaVinculada(null); }}>
              <Text style={[styles.tabText, tab === 'criar' && styles.tabTextActive]}>Criar Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('editar')}>
              <Text style={[styles.tabText, tab === 'editar' && styles.tabTextActive]}>Editar</Text>
            </TouchableOpacity>
          </View>

          {tab === 'editar' && (
            <View style={styles.editSelectionContainer}>
              <Text style={styles.sectionLabel}>Selecione o Produto</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                {produtos?.map((prod) => (
                  <TouchableOpacity 
                    key={prod.id} 
                    style={[styles.produtoCard, produtoEdit?.id === prod.id && styles.iconCardActive]}
                    onPress={() => {
                      setProdutoEdit(prod);
                      setNome(prod.nome);
                      setValor(prod.preco.toString());
                      setImagemSelecionada(prod.imagem || imagens[0]);
                      setCategoriaVinculada(prod.categoriaId); // Puxa a categoria antiga dele
                    }}
                  >
                    <Image source={{ uri: prod.imagem || imagens[0] }} style={styles.produtoCardImage} />
                    <Text style={styles.produtoCardText} numberOfLines={1}>{prod.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* NOVO: SELEÇÃO DA CATEGORIA DO PRODUTO */}
          <Text style={styles.sectionLabel}>Vincular a uma Categoria</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {categorias?.map((cat) => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[styles.catEditCard, categoriaVinculada === cat.id && styles.iconCardActive]}
                  onPress={() => setCategoriaVinculada(cat.id)}
                >
                  <View style={styles.catIconCircleMini}>
                    {cat.icone?.includes('file:') || cat.icone?.includes('http') || cat.icone?.includes('data:image') ? (
                      <Image source={{ uri: cat.icone }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                    ) : (
                      <Feather name={cat.icone || 'box'} size={20} color="#ea580c" />
                    )}
                  </View>
                  <Text style={styles.catCardText} numberOfLines={1}>{cat.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionLabel}>
            {tab === 'criar' ? 'Selecione ou Tire Uma Foto' : 'Editar Foto'}
          </Text>

          <View style={styles.scrollWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              <TouchableOpacity style={styles.imageCardBtn} onPress={pickImage}>
                <Feather name="camera" size={30} color="#ea580c" />
                <Text style={styles.imageCardBtnText}>Galeria</Text>
              </TouchableOpacity>

              {/* Prévia da imagem selecionada da galeria ou da edição */}
              {imagemSelecionada && !imagens.includes(imagemSelecionada) && (
                <TouchableOpacity 
                  style={[styles.imageCard, styles.iconCardActive]}
                  onPress={() => {}}
                >
                  <Image source={{ uri: imagemSelecionada }} style={styles.imageCardImage} />
                </TouchableOpacity>
              )}

              {imagens.map((img, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.imageCard, imagemSelecionada === img && styles.iconCardActive]}
                  onPress={() => setImagemSelecionada(img)}
                >
                  {/* Lógica inteligente para suportar links da web e arquivos require locais */}
                  <Image 
                    source={typeof img === 'string' ? { uri: img } : img} 
                    style={styles.imageCardImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputsContainer}>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Nome" 
              placeholderTextColor="#ea580c"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput 
              style={styles.modalInput} 
              placeholder="Valor" 
              placeholderTextColor="#ea580c"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
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
    marginBottom: 10 
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
    marginBottom: 10,
  },
  scrollWrapper: { 
    width: '100%', 
    paddingLeft: '10%', 
    marginBottom: 15 
  },
  scrollContent: { 
    paddingRight: 40, 
    alignItems: 'center' 
  },
  iconScroll: { 
    maxHeight: 120, 
    paddingLeft: '10%' 
  },
  produtoCard: { 
    width: 70, 
    height: 100, 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginRight: 15, 
    backgroundColor: '#fff', 
    alignItems: 'center' 
  },
  produtoCardImage: { 
    width: '100%', 
    height: 70 
  },
  produtoCardText: { 
    fontSize: 12, 
    padding: 5, 
    color: '#333' 
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
    height: 110, borderRadius: 20, 
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
  imageCard: { 
    width: 80, 
    height: 110, 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginRight: 15 
  },
  imageCardImage: { 
    width: '100%', 
    height: '100%' 
  },
  iconCardActive: { 
    borderWidth: 5, 
    borderColor: '#000' 
  },
  inputsContainer: { 
    width: '80%', 
    gap: 15 
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
    marginTop: 20, 
    marginBottom: 30, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
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