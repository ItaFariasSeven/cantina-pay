import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import BackApp from '../components/BackApp';
import ModalParaPagamentos from '../components/ModalParaPagamentos';
import api from '../api/api';

export default function HistoryBuy() {
  const [searchText, setSearchText] = useState('');
  const [compraSelecionada, setCompraSelecionada] = useState(null);
  const [dividaTotalAluno, setDividaTotalAluno] = useState(0);
  
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca as compras no banco de dados
  const carregarCompras = async () => {
    setLoading(true);
    try {
      const response = await api.get('/compras');
      // Ordena da mais recente para a mais antiga
      const ordenadas = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCompras(ordenadas);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de compras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCompras();
  }, []);

  // Inteligência de busca
  const filtrados = compras.filter(item => {
    const nomeAluno = item.cliente?.nomeAluno || '';
    const nomePai = item.cliente?.nomePai || '';
    return (
      nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
      nomePai.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Calcula a dívida total de um aluno específico
  const calcularDividaTotal = (clienteId) => {
    return compras
      .filter(c => c.clienteId === clienteId && !c.pago)
      .reduce((acc, curr) => acc + Number(curr.total), 0);
  };

  const abrirModalPagamento = (item) => {
    const divida = calcularDividaTotal(item.clienteId);
    setDividaTotalAluno(divida);
    setCompraSelecionada(item);
  };

  // Formata a data (Ex: 04 Dez, 14:30)
  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, '0');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mes = meses[data.getMonth()];
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia} ${mes}, ${hora}:${minuto}`;
  };

  const RenderItem = ({ item, index }) => {
    const isPar = index % 2 === 0;

    return (
      <TouchableOpacity 
        style={[styles.itemContainer, isPar ? styles.itemCorEscura : styles.itemCorClara]}
        activeOpacity={0.8}
        onPress={() => abrirModalPagamento(item)}
      >
        <View style={styles.colunaEsquerda}>
          <Text style={styles.nomeAlunoText} numberOfLines={1}>
            {item.cliente?.nomeAluno || 'Sem Aluno'}
          </Text>
          <Text style={styles.nomePaiText} numberOfLines={1}>
            {item.cliente?.nomePai || 'Sem Pai'}
          </Text>
        </View>
        <Text style={styles.dataText}>{formatarData(item.createdAt)}</Text>
        <Text style={styles.valorText}>R$ {Number(item.total).toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <BackApp showSearch={false} title="Histórico de Compras">
      <View style={styles.contentWrapper}>
        <View style={styles.searchWrapper}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#78716c"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ea580c" style={{ marginTop: 50 }} />
        ) : (
          <FlatList 
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={RenderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma compra encontrada.</Text>
            }
          />
        )}
      </View>

      <ModalParaPagamentos 
        visible={!!compraSelecionada}
        compra={compraSelecionada}
        dividaTotal={dividaTotalAluno}
        onClose={() => setCompraSelecionada(null)}
        onSuccess={() => {
          setCompraSelecionada(null);
          carregarCompras(); // Atualiza a lista após pagar
        }}
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
    color: '#333333' 

  },
  emptyText: { 
    color: '#ffffff', 
    textAlign: 'center', 
    marginTop: 30, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 

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
    paddingRight: 10 

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
  dataText: { 
    color: '#707070', 
    fontSize: 13, 
    fontWeight: 'bold', 
    width: 100, 
    textAlign: 'center' 
  },
  valorText: { 
    color: '#707070', 
    fontSize: 16, 
    fontWeight: 'bold', 
    width: 85, 
    textAlign: 'right' 
  },
});

