import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../api/api';

// IMPORTAÇÃO DOS COMPONENTES
import BackApp from '../components/BackApp';
import ModalCategoria from '../components/ModalCategoria';
import ModalProduto from '../components/ModalProduto';
import ModalCliente from '../components/ModalCliente';

const IMAGENS_CATEGORIA = {
  'Bebidas': require('../assets/Category/Bebidas.jpg'),
  'Bomboniere': require('../assets/Category/Bomboniere.jpg'),
  'Fit': require('../assets/Category/Fit.jpg'),
  'Salgadinhos': require('../assets/Category/Salgadinhos.jpg'),
  'Salgados': require('../assets/Category/Salgados.jpg'),
  'Sobremesa': require('../assets/Category/Sobremesa.jpg'),
  'Veganos': require('../assets/Category/Veganos.jpg'),
};

export default function Create() {
  const [searchText, setSearchText] = useState('');
  
  // Estados para abrir os modais
  const [modalCatVisible, setModalCatVisible] = useState(false);
  const [modalProdVisible, setModalProdVisible] = useState(false);
  const [modalCliVisible, setModalCliVisible] = useState(false);

  // Estados dos Dados do Banco
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar tudo do Banco de Dados
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes, cliRes] = await Promise.all([
        api.get('/categorias'),
        api.get('/produtos'),
        api.get('/clientes')
      ]);
      setCategorias(catRes.data || []);
      setProdutos(prodRes.data || []);
      setClientes(cliRes.data || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inteligência de busca para os alunos
  const clientesFiltrados = clientes.filter(item => 
    item.nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nomePai.toLowerCase().includes(searchText.toLowerCase())
  );

  // Componente do Cabeçalho e das Listas Horizontais (Rola junto com os alunos)
  const ListHeader = () => (
    <View style={styles.headerWrapper}>
      
      {/* BARRA DE PESQUISA (Logo abaixo do BackApp) */}
      <View style={styles.searchWrapper}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Pesquisar cliente..."
          placeholderTextColor="#78716c"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* BOTÕES DE AÇÃO (Abrem os Modais) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionButtonsScroll} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setModalCatVisible(true)}>
          <Text style={styles.actionBtnText}>Categorias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setModalCliVisible(true)}>
          <Text style={styles.actionBtnText}>Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setModalProdVisible(true)}>
          <Text style={styles.actionBtnText}>Produtos</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SESSÃO: CATEGORIAS CADASTRADAS */}
      <Text style={styles.sectionTitle}>Categorias</Text>
      {categorias.length === 0 && !loading && (
        <Text style={styles.emptyHorizontal}>Nenhuma categoria cadastrada</Text>
      )}
      <FlatList 
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingBottom: 10 }}
        data={categorias}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.catItemContainer}>
            <View style={styles.catIconCircle}>
              {/* Adicionamos 'data:' e 'blob:' na verificação! */}
              {item.icone?.includes('file:') || item.icone?.includes('http') || item.icone?.includes('data:') || item.icone?.includes('blob:') ? (
                <Image source={{ uri: item.icone }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              ) : IMAGENS_CATEGORIA[item.icone] ? (
                <Image source={IMAGENS_CATEGORIA[item.icone]} style={{ width: 50, height: 50, borderRadius: 25 }} />
              ) : (
                <Feather name={item.icone || 'box'} size={24} color="#ea580c" />
              )}
            </View>
            <Text style={styles.catItemText} numberOfLines={1}>{item.nome}</Text>
          </View>
        )}
      />

      {/* SESSÃO: PRODUTOS CADASTRADOS */}
      <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Produtos</Text>
      {produtos.length === 0 && !loading && (
        <Text style={styles.emptyHorizontal}>Nenhum produto cadastrado</Text>
      )}
      <FlatList 
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingBottom: 10 }}
        data={produtos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.prodItemContainer}>
            <Image source={{ uri: item.imagem || 'https://placehold.co/74x107' }} style={styles.prodImage} />
            <View style={styles.prodInfo}>
              <Text style={styles.prodName} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.prodPrice}>R${Number(item.preco).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      {/* TÍTULO DA SESSÃO DE CLIENTES */}
      <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 10 }]}>Clientes</Text>
    </View>
  );

  // Passos do tutorial específicos desta tela (Gestão)
  const passosTutorialCreate = [
    {
      titulo: '1. Gestão de Categorias',
      descricao: 'Toque no botão "Categorias" para adicionar uma nova ou editar o ícone e o nome de uma já existente.'
    },
    {
      titulo: '2. Gestão de Clientes',
      descricao: 'Toque em "Clientes" para cadastrar novos alunos e seus responsáveis. Eles aparecerão na lista abaixo.'
    },
    {
      titulo: '3. Gestão de Produtos',
      descricao: 'Toque em "Produtos" para cadastrar itens, definir o preço, escolher a foto e vinculá-los a uma categoria.'
    },
  ];

  return (
    <BackApp showSearch={false} title="Criar Novo" tutorialPassos={passosTutorialCreate}>
      
      <View style={styles.contentWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList 
            data={clientesFiltrados}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true}
            ListHeaderComponent={<ListHeader />}
            renderItem={({ item, index }) => {
              const isPar = index % 2 === 0;
              return (
                <View style={[styles.clienteItem, isPar ? styles.itemCorEscura : styles.itemCorClara]}>
                  <View style={styles.colunaEsquerda}>
                    <Text style={styles.nomeAlunoText}>{item.nomeAluno}</Text>
                    <Text style={styles.nomePaiText}>{item.nomePai}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
            }
          />
        )}
      </View>

      {/* INJEÇÃO DOS MODAIS COM CALLBACK DE ATUALIZAÇÃO */}
      <ModalCategoria 
        visible={modalCatVisible} 
        onClose={() => setModalCatVisible(false)} 
        onSuccess={fetchData} 
        categorias={categorias}
        produtos={produtos}
      />
      <ModalProduto 
        visible={modalProdVisible} 
        onClose={() => setModalProdVisible(false)} 
        onSuccess={fetchData} 
        produtos={produtos}
        categorias={categorias}
      />
      <ModalCliente 
        visible={modalCliVisible} 
        onClose={() => setModalCliVisible(false)} 
        onSuccess={fetchData}
        clientes={clientes} 
      />

    </BackApp>
  );
}

const styles = StyleSheet.create({
  contentWrapper: { 
    flex: 1, 
    width: '100%', 
    height: '96%' 
  },
  headerWrapper: { 
    paddingBottom: 10 
  },
  searchWrapper: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  searchInput: { 
    backgroundColor: '#ffffff', 
    height: 40, 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    fontSize: 14, 
    color: '#333333' },
  actionButtonsScroll: { 
    marginBottom: 25 
  },
  actionBtn: { 
    backgroundColor: '#fcd34d', 
    paddingVertical: 10, 
    paddingHorizontal: 10, 
    borderRadius: 10 
  },
  actionBtnText: { 
    color: '#431407', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    color: '#431407', 
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    marginBottom: 15,
    borderTopWidth: 1
  },
  emptyHorizontal: { 
    color: '#431407', 
    paddingHorizontal: 20, 
    fontStyle: 'italic', 
    marginBottom: 10 
  },
  catItemContainer: { 
    alignItems: 'center', 
    width: 75 
  },
  catIconCircle: { 
    width: 60, 
    height: 60, 
    backgroundColor: '#fef3c7', 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: '#ea580c', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },
  catItemText: { 
    fontSize: 11, 
    color: '#431407', 
    fontWeight: '500', 
    textAlign: 'center' 
  },
  prodItemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: 180, 
    backgroundColor: '#fcd34d', 
    padding: 8, 
    borderRadius: 15 
  },
  prodImage: { 
    width: 60, 
    height: 80, 
    borderRadius: 12, 
    backgroundColor: '#ccc' 
  },
  prodInfo: { 
    marginLeft: 10, 
    flex: 1 
  },
  prodName: { 
    color: '#431407', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  prodPrice: { 
    color: '#ea580c', 
    fontSize: 14, 
    marginTop: 5, 
    fontWeight: 'bold' 
  },
  clienteItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
  },
  itemCorEscura: { 
    backgroundColor: '#eab308' 
  },
  itemCorClara: { 
    backgroundColor: '#fcd34d' 
  },
  colunaEsquerda: { 
    flex: 1, 
    justifyContent: 'center',
  },
  nomeAlunoText: { 
    color: '#707070', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  nomePaiText: { 
    color: '#707070', 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginTop: 2 
  },
  emptyText: { 
    color: '#431407', 
    textAlign: 'center', 
    marginTop: 30, 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});
