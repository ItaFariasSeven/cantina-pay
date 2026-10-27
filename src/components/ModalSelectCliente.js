import React, { useState, useEffect } from 'react';
import { View,  Text,  StyleSheet,  TouchableOpacity,  TextInput,  FlatList,  ActivityIndicator,  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import api from '../api/api';
import { useCarrinho } from '../context/CarrinhoContext';

export default function ModalSelectCliente({ onClose }) {
  // Pega o ID da compra criada no carrinho para vincularmos ao cliente agora
  const { compraPendenteId, setCompraPendenteId } = useCarrinho();
  
  const [searchText, setSearchText] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  
  // Estados para gerenciar a API
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Busca os clientes no banco de dados assim que o modal abre
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
        
        // Se a lista não vier vazia, já deixa o primeiro aluno pré-selecionado
        if (response.data.length > 0) {
          setAlunoSelecionado(response.data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de clientes.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchClientes();
  }, []);

  // Lógica de filtro da barra de pesquisa
  const alunosFiltrados = clientes.filter(aluno => 
    aluno.nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
    aluno.nomePai.toLowerCase().includes(searchText.toLowerCase())
  );

  // Função que roda ao apertar "Confirmar"
  async function handleConfirmar() {
    if (!alunoSelecionado) {
      Alert.alert('Atenção', 'Selecione um cliente para vincular à compra.');
      return;
    }

    setSalvando(true);
    try {
      // Manda TUDO (Carrinho + Cliente) em uma única tacada pro banco!
      await api.post('/compras', {
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
        valorManual: Number(valorManual) || 0,
        total: total,
        clienteId: alunoSelecionado // <--- ID do aluno escolhido
      });
      
      Alert.alert('Sucesso!', 'Compra salva e vinculada com sucesso.');
      setValorManual(0); // Limpa o valor manual após o sucesso
      onClose(); // Fecha o modal e volta para a tela inicial
    } catch (error) {
      console.error('Erro ao vincular cliente:', error);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível finalizar a compra.');
    } finally {
      setSalvando(false);
    }
  }

  const renderizarAluno = ({ item }) => {
    const isSelecionado = item.id === alunoSelecionado;

    return (
      <TouchableOpacity 
        style={[
          styles.alunoItem, 
          isSelecionado ? styles.alunoItemAtivo : null
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
          placeholder="Pesquisar..."
          placeholderTextColor="#78716c"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* CAIXA COM A LISTA DE ALUNOS */}
      <View style={styles.listBorderContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fafaf9" style={{ marginTop: 50 }} />
        ) : (
          <FlatList 
            data={alunosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderizarAluno}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
            }
          />
        )}
      </View>

      {/* RODAPÉ COM BOTÃO CONFIRMAR */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmar}
          disabled={salvando || loading}
        >
          {salvando ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100,
  },
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
    borderColor: '#ea580c', 
  },
  title: {
    color: '#fafaf9',
    fontSize: 28,
    fontWeight: 'bold',
  },
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
  listBorderContainer: {
    flex: 1,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#ffedd5',
    padding: 10,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  alunoItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 5,
  },
  alunoItemAtivo: {
    backgroundColor: '#dc2626', 
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
    marginTop: 2, 
  },
  emptyText: {
    color: '#ffedd5',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30, 
  },
  confirmButton: {
    backgroundColor: '#fcd34d', 
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
    color: '#dc2626', 
    fontSize: 20,
    fontWeight: 'bold',
  }
});
