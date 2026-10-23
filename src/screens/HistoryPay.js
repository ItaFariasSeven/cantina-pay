import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import BackApp from '../components/BackApp';

export default function HistoryPay() {
  
  // Estado para a barra de pesquisa
  const [searchText, setSearchText] = useState('');

  // Lista fictícia de histórico de pagamentos
  const historico = [
    { id: '1', nomeAluno: 'Nome Do Aluno 1', nomePai: 'Nome Do Pai Aluno', data: '29 Nov, 15:20 pm', valor: 'R$30.00' },
    { id: '2', nomeAluno: 'João Silva', nomePai: 'Carlos Silva', data: '29 Nov, 15:20 pm', valor: 'R$45.00' },
    { id: '3', nomeAluno: 'Maria Souza', nomePai: 'Ana Souza', data: '30 Nov, 08:10 am', valor: 'R$22.50' },
    { id: '4', nomeAluno: 'Pedro Santos', nomePai: 'Marcos Santos', data: '01 Dez, 12:45 pm', valor: 'R$15.00' },
    { id: '5', nomeAluno: 'Lucas Oliveira', nomePai: 'Roberto Oliveira', data: '02 Dez, 14:30 pm', valor: 'R$60.00' },
    { id: '6', nomeAluno: 'Ana Clara', nomePai: 'José Pereira', data: '02 Dez, 16:00 pm', valor: 'R$30.00' },
    { id: '7', nomeAluno: 'Beatriz Costa', nomePai: 'Fernando Costa', data: '03 Dez, 09:20 am', valor: 'R$10.00' },
    { id: '8', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
    { id: '9', nomeAluno: 'Felipe Mendes', nomePai: 'Ricardo Mendes', data: '04 Dez, 10:00 am', valor: 'R$50.00' },
    { id: '10', nomeAluno: 'Julia Lima', nomePai: 'Sérgio Lima', data: '04 Dez, 11:30 am', valor: 'R$25.00' },
    { id: '11', nomeAluno: 'Julia Lima', nomePai: 'Sérgio Lima', data: '04 Dez, 11:30 am', valor: 'R$25.00' },
    { id: '12', nomeAluno: 'Julia Limão', nomePai: 'Sérgio Lima', data: '04 Dez, 11:30 am', valor: 'R$25.00' },
  ];

  // Inteligência de busca (filtra por aluno ou pai)
  const filtrados = historico.filter(item => 
    item.nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nomePai.toLowerCase().includes(searchText.toLowerCase())
  );

  // Componente que desenha cada linha (agora é apenas uma View, sem TouchableOpacity)
  const RenderItem = ({ item, index }) => {
    // Lógica para alternar as cores (Zebra)
    const isPar = index % 2 === 0;

    return (
      <View style={[styles.itemContainer, isPar ? styles.itemCorEscura : styles.itemCorClara]}>
        <View style={styles.colunaEsquerda}>
          <Text style={styles.nomeAlunoText}>{item.nomeAluno}</Text>
          <Text style={styles.nomePaiText}>{item.nomePai}</Text>
        </View>
        <Text style={styles.dataText}>{item.data}</Text>
        <Text style={styles.valorText}>{item.valor}</Text>
      </View>
    );
  };

  return (
    <BackApp showSearch={false} title="Histórico de Pagamentos">
      
      <View style={styles.contentWrapper}>
        
        {/* BARRA DE PESQUISA */}
        <View style={styles.searchWrapper}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#78716c"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* LISTA COM ROLAGEM INFINITA */}
        <FlatList 
          data={filtrados}
          keyExtractor={(item) => item.id}
          renderItem={RenderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          }
        />
        
      </View>

    </BackApp>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    width: '100%', // Faz a lista e a pesquisa ocuparem a tela toda dentro do BackApp
    height: '96%'
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
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // ESTILOS DA LISTA (Apenas leitura)
  itemContainer: {
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
});
