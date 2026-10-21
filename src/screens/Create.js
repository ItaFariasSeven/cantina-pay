import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

// IMPORTAÇÃO DOS COMPONENTES
import BackApp from '../components/BackApp';
import ModalCategoria from '../components/ModalCategoria';
import ModalProduto from '../components/ModalProduto';
import ModalCliente from '../components/ModalCliente';

export default function Create() {
  const [searchText, setSearchText] = useState('');
  
  // Estados para abrir os modais
  const [modalCatVisible, setModalCatVisible] = useState(false);
  const [modalProdVisible, setModalProdVisible] = useState(false);
  const [modalCliVisible, setModalCliVisible] = useState(false);

  // Dados Mockados
  const categorias = [
    { id: '1', nome: 'Sobremesa', icon: 'coffee' },
    { id: '2', nome: 'Lanches', icon: 'shopping-bag' },
    { id: '3', nome: 'Bebidas', icon: 'droplet' },
  ];

  const produtos = [
    { id: '1', nome: 'Pão Pizza', preco: 'R$6,00', imagem: 'https://placehold.co/74x107' },
    { id: '2', nome: 'Folhado', preco: 'R$10,00', imagem: 'https://placehold.co/74x107/orange' },
    { id: '3', nome: 'Bolo', preco: 'R$8,00', imagem: 'https://placehold.co/74x107/png' },
  ];

  const clientes = [
    { id: '1', nomeAluno: 'Nome Do Aluno 1', nomePai: 'Nome Do Pai Aluno', data: '29 Nov, 15:20 pm', valor: 'R$30.00' },
    { id: '2', nomeAluno: 'João Silva', nomePai: 'Carlos Silva', data: '29 Nov, 15:20 pm', valor: 'R$45.00' },
    { id: '3', nomeAluno: 'Maria Souza', nomePai: 'Ana Souza', data: '30 Nov, 08:10 am', valor: 'R$22.50' },
    { id: '4', nomeAluno: 'Pedro Santos', nomePai: 'Marcos Santos', data: '01 Dez, 12:45 pm', valor: 'R$15.00' },
  ];

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
          placeholder="Search"
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
      <FlatList 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
        data={categorias}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.catItemContainer}>
            <View style={styles.catIconCircle}>
              <Feather name={item.icon} size={24} color="#ea580c" />
            </View>
            <Text style={styles.catItemText}>{item.nome}</Text>
          </View>
        )}
      />

      {/* SESSÃO: PRODUTOS CADASTRADOS */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Produtos</Text>
      <FlatList 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.prodItemContainer}>
            <Image source={{ uri: item.imagem }} style={styles.prodImage} />
            <View style={styles.prodInfo}>
              <Text style={styles.prodName}>{item.nome}</Text>
              <Text style={styles.prodPrice}>{item.preco}</Text>
            </View>
          </View>
        )}
      />

      {/* TÍTULO DA SESSÃO DE CLIENTES */}
      <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 10 }]}>Clientes</Text>
    </View>
  );

  return (
    <BackApp showSearch={false} title="Criar Novo">
      
      <View style={styles.contentWrapper}>
        {/* LISTA PRINCIPAL DE CLIENTES */}
        <FlatList 
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item, index }) => {
            const isPar = index % 2 === 0;
            return (
              <View style={[styles.clienteItem, isPar ? styles.itemCorEscura : styles.itemCorClara]}>
                <View style={styles.colunaEsquerda}>
                  <Text style={styles.nomeAlunoText}>{item.nomeAluno}</Text>
                  <Text style={styles.nomePaiText}>{item.nomePai}</Text>
                </View>
                <Text style={styles.dataText}>{item.data}</Text>
                <Text style={styles.valorText}>{item.valor}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
          }
        />
      </View>

      {/* INJEÇÃO DOS MODAIS IMPORTADOS */}
      <ModalCategoria visible={modalCatVisible} onClose={() => setModalCatVisible(false)} />
      <ModalProduto visible={modalProdVisible} onClose={() => setModalProdVisible(false)} />
      <ModalCliente visible={modalCliVisible} onClose={() => setModalCliVisible(false)} />

    </BackApp>
  );
}

const styles = StyleSheet.create({
  contentWrapper: { 
    flex: 1, 
    width: '100%', 
  },
  headerWrapper: { 
    paddingBottom: 10,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInput: { 
    backgroundColor: '#ffffff', 
    height: 40, 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    fontSize: 14, 
    color: '#333333',
  },
  actionButtonsScroll: { 
    marginBottom: 25,
  },
  actionBtn: { 
    backgroundColor: '#fcd34d', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 10,
  },
  actionBtnText: { 
    color: '#431407', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  sectionTitle: { 
    color: '#431407', 
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    marginBottom: 15,
  },
  catItemContainer: { 
    alignItems: 'center', 
    width: 70,
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
    marginBottom: 8,
  },
  catItemText: { 
    fontSize: 10, 
    color: '#431407', 
    fontWeight: '500',
  },
  prodItemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: 180,
  },
  prodImage: { 
    Width: 74, 
    height: 107, 
    borderRadius: 20, 
    backgroundColor: '#ccc',
  },
  prodInfo: { 
    marginLeft: 10, 
    flex: 1,
  },
  prodName: { 
    color: '#431407', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  prodPrice: { 
    color: '#ea580c', 
    fontSize: 16, 
    marginTop: 5,
  },
  clienteItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
  },
  itemCorEscura: { backgroundColor: '#eab308' },
  itemCorClara: { backgroundColor: '#fcd34d' },
  colunaEsquerda: { 
    flex: 1, 
    justifyContent: 'center',
  },
  nomeAlunoText: { 
    color: '#707070', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  nomePaiText: { 
    color: '#707070', 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginTop: 2,
  },
  dataText: { 
    color: '#707070', 
    fontSize: 13, 
    fontWeight: 'bold', 
    width: 120, 
    textAlign: 'center',
  },
  valorText: { 
    color: '#707070', 
    fontSize: 18, 
    fontWeight: 'bold', 
    width: 80, 
    textAlign: 'right',
  },
  emptyText: {
    color: '#431407',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
