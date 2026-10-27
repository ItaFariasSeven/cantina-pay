import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import BackApp from '../components/BackApp';
import api from '../api/api';

export default function HistoryPay() {
  const [searchText, setSearchText] = useState('');
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarPagamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pagamentos');
      // Ordena do mais recente para o mais antigo
      const ordenados = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPagamentos(ordenados);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPagamentos();
  }, []);

  // Filtra pesquisando pelo nome do aluno ou pai que está dentro da Compra associada ao Pagamento
  const filtrados = pagamentos.filter(item => {
    const nomeAluno = item.compra?.cliente?.nomeAluno || '';
    const nomePai = item.compra?.cliente?.nomePai || '';
    return (
      nomeAluno.toLowerCase().includes(searchText.toLowerCase()) ||
      nomePai.toLowerCase().includes(searchText.toLowerCase())
    );
  });

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
      <View style={[styles.itemContainer, isPar ? styles.itemCorEscura : styles.itemCorClara]}>
        <View style={styles.colunaEsquerda}>
          <Text style={styles.nomeAlunoText} numberOfLines={1}>
            {item.compra?.cliente?.nomeAluno || 'Sem Aluno'}
          </Text>
          <Text style={styles.nomePaiText} numberOfLines={1}>
            {item.compra?.cliente?.nomePai || 'Sem Pai'}
          </Text>
        </View>
        <Text style={styles.dataText}>{formatarData(item.createdAt)}</Text>
        <Text style={styles.valorText}>R$ {Number(item.valor).toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <BackApp showSearch={false} title="Histórico de Pagamentos">
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
              <Text style={styles.emptyText}>Nenhum pagamento encontrado.</Text>
            }
          />
        )}
        
      </View>
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
    color: '#16a34a', 
    fontSize: 16, 
    fontWeight: 'bold', 
    width: 85, 
    textAlign: 'right' 

  }, 
});
