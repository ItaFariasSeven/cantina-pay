import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import BackApp from '../components/BackApp';
import ModalParaPagamentos from '../components/ModalParaPagamentos'; // Importa o modal separado

export default function HistoryBuy() {
  
  // 1. Estados
  const [searchText, setSearchText] = useState('');
  const [compraSelecionada, setCompraSelecionada] = useState(null);

  // 2. Lista fictícia
  const historico = [
    { id: '1', nomeAluno: 'Nome Do Aluno 1', nomePai: 'Nome Do Pai Aluno', data: '29 Nov, 15:20 pm', valor: 'R$30.00' },
    { id: '2', nomeAluno: 'João Silva', nomePai: 'Carlos Silva', data: '29 Nov, 15:20 pm', valor: 'R$45.00' },
    { id: '3', nomeAluno: 'Maria Souza', nomePai: 'Ana Souza', data: '30 Nov, 08:10 am', valor: 'R$22.50' },
    { id: '4', nomeAluno: 'Pedro Santos', nomePai: 'Marcos Santos', data: '01 Dez, 12:45 pm', valor: 'R$15.00' },
    { id: '5', nomeAluno: 'Lucas Oliveira', nomePai: 'Roberto Oliveira', data: '02 Dez, 14:30 pm', valor: 'R$60.00' },
    { id: '6', nomeAluno: 'Ana Clara', nomePai: 'José Pereira', data: '02 Dez, 16:00 pm', valor: 'R$30.00' },
    { id: '7', nomeAluno: 'Beatriz Costa', nomePai: 'Fernando Costa', data: '03 Dez, 09:20 am', valor: 'R$10.00' },
    { id: '8', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
    { id: '9', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
    { id: '10', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
    { id: '11', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
    { id: '12', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida', data: '03 Dez, 11:15 am', valor: 'R$18.00' },
  ];

  // 3. Inteligência de busca
  const filtrados = historico.filter(item => 
    item.nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nomePai.toLowerCase().includes(searchText.toLowerCase())
  );

  // 4. Componente que desenha cada linha
  const RenderItem = ({ item, index }) => {
    const isPar = index % 2 === 0;

    return (
      <TouchableOpacity 
        style={[styles.itemContainer, isPar ? styles.itemCorEscura : styles.itemCorClara]}
        activeOpacity={0.8}
        onPress={() => setCompraSelecionada(item)} // Abre o Modal passando os dados
      >
        <View style={styles.colunaEsquerda}>
          <Text style={styles.nomeAlunoText}>{item.nomeAluno}</Text>
          <Text style={styles.nomePaiText}>{item.nomePai}</Text>
        </View>
        <Text style={styles.dataText}>{item.data}</Text>
        <Text style={styles.valorText}>{item.valor}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // Usa o seu BackApp original!
    <BackApp showSearch={false} title="Histórico de Compras">
      
      {/* Container ocupando 100% da largura, pois o BackApp centraliza tudo por padrão */}
      <View style={styles.contentWrapper}>
        
        {/* BARRA DE PESQUISA ESPECÍFICA (Fica logo abaixo do título) */}
        <View style={styles.searchWrapper}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#78716c"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* LISTA */}
        <FlatList 
          data={filtrados}
          keyExtractor={(item) => item.id}
          renderItem={RenderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma compra encontrada.</Text>
          }
        />
        
      </View>

      {/* O MODAL SEPARADO */}
      <ModalParaPagamentos 
        visible={!!compraSelecionada}
        compra={compraSelecionada}
        onClose={() => setCompraSelecionada(null)}
        onPagar={(valorInformado) => {
          console.log(`Pagar: R$ ${valorInformado}`);
        }}
        onConfirmar={() => {
          console.log("Confirmar clicado");
          setCompraSelecionada(null);
        }}
      />

    </BackApp>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    width: '100%', // Essencial para a lista ocupar a tela toda dentro do BackApp
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
  // ESTILOS DA LISTA DE ALUNOS
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemCorEscura: { backgroundColor: '#eab308' }, // bg-yellow-500
  itemCorClara: { backgroundColor: '#fcd34d' },  // bg-amber-300
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
