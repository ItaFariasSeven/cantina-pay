import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function ModalSelectCliente({ onClose }) {
  // Estado para a inteligência da barra de pesquisa
  const [searchText, setSearchText] = useState('');
  
  // Estado para saber qual aluno foi clicado (começa selecionando o ID 1)
  const [alunoSelecionado, setAlunoSelecionado] = useState('1');

  // Lista "falsa" de alunos. Pode colocar quantos quiser, a tela vai rolar!
  const listaAlunos = [
    { id: '1', nomeAluno: 'Nome Do Aluno 1', nomePai: 'Nome Do Pai Aluno' },
    { id: '2', nomeAluno: 'João Silva', nomePai: 'Carlos Silva' },
    { id: '3', nomeAluno: 'Maria Souza', nomePai: 'Ana Souza' },
    { id: '4', nomeAluno: 'Pedro Santos', nomePai: 'Marcos Santos' },
    { id: '5', nomeAluno: 'Lucas Oliveira', nomePai: 'Roberto Oliveira' },
    { id: '6', nomeAluno: 'Ana Clara', nomePai: 'José Pereira' },
    { id: '7', nomeAluno: 'Beatriz Costa', nomePai: 'Fernando Costa' },
    { id: '8', nomeAluno: 'Gabriel Almeida', nomePai: 'Paulo Almeida' },
    { id: '9', nomeAluno: 'Felipe Mendes', nomePai: 'Ricardo Mendes' },
    { id: '10', nomeAluno: 'Julia Lima', nomePai: 'Sérgio Lima' },
  ];

  // Lógica que filtra os alunos em tempo real conforme você digita
  const alunosFiltrados = listaAlunos.filter(aluno => 
    aluno.nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
    aluno.nomePai.toLowerCase().includes(searchText.toLowerCase())
  );

  // Como cada item da lista deve ser desenhado na tela
  const renderizarAluno = ({ item }) => {
    // Verifica se este item é o que está selecionado
    const isSelecionado = item.id === alunoSelecionado;

    return (
      <TouchableOpacity 
        style={[
          styles.alunoItem, 
          isSelecionado ? styles.alunoItemAtivo : null // Aplica fundo laranja se estiver selecionado
        ]}
        onPress={() => setAlunoSelecionado(item.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.alunoNomeText}>{item.nomeAluno}</Text>
        <Text style={styles.alunoPaiText}>{item.nomePai}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconContainer} onPress={onClose}>
            <Feather name="arrow-left" size={24} color="#ea580c" />
          </TouchableOpacity>
          <Text style={styles.title}>Cliente</Text>
        </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#78716c"
          value={searchText}
          onChangeText={setSearchText} // Atualiza o filtro a cada letra digitada
        />
      </View>

      {/* CAIXA COM A LISTA DE ALUNOS (Com rolagem automática) */}
      <View style={styles.listBorderContainer}>
        <FlatList 
          data={alunosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderizarAluno}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          // Mensagem amigável caso a pesquisa não encontre ninguém
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
          }
        />
      </View>

      {/* RODAPÉ COM BOTÃO CONFIRMAR */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            // Por enquanto sem ação, como você pediu!
            console.log("Confirmar clicado! Aluno ID:", alunoSelecionado);
          }}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    height: '100%',
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100,
  },
  
  // --- CABEÇALHO ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
    gap: 10,
  },
  iconContainer: {
    width: 50,
    height: 40,
    backgroundColor: '#fafaf9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ea580c', // Borda laranja do ícone
  },
  title: {
    color: '#fafaf9',
    fontSize: 28,
    fontWeight: 'bold',
  },

  // --- PESQUISA ---
  searchContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    height: 40,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#333333',
  },

  // --- LISTA DE ALUNOS ---
  listBorderContainer: {
    flex: 1,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#ffedd5', // outline-orange-100 do Figma
    padding: 10,
    marginBottom: 20, // Dá espaço para o botão Confirmar não colar na lista
  },
  listContent: {
    paddingBottom: 10,
  },
  alunoItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30, // Arredonda os cantos como na imagem
    marginBottom: 5,
  },
  alunoItemAtivo: {
    backgroundColor: '#dc2626', // Fundo laranja apenas para o selecionado
  },
  alunoNomeText: {
    color: '#fafaf9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alunoPaiText: {
    color: '#fafaf9',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2, // Pequeno respiro entre os nomes
  },
  emptyText: {
    color: '#ffedd5',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },

  // --- RODAPÉ E BOTÃO ---
  footer: {
    alignItems: 'center',
    marginBottom: 30, // Distância do botão para o fundo da tela
  },
  confirmButton: {
    backgroundColor: '#fcd34d', // bg-amber-300
    width: 160,
    height: 45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#dc2626', // Texto vermelho combinando com o fundo
    fontSize: 20,
    fontWeight: 'bold',
  }
});
