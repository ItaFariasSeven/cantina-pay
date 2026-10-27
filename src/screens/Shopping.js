import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Modal, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackApp from '../components/BackApp';
import ModalCarrinhoCompras from '../components/ModalCarrinhoCompras';
import ModalSelectCliente from '../components/ModalSelectCliente';
import { useCarrinho } from '../context/CarrinhoContext';
import api from '../api/api';

const ICONES_CATEGORIA = {
  Salgados: 'food-variant',
  Veganos: 'leaf',
  Sobremesa: 'cupcake',
  Bebidas: 'glass-cocktail',
};

export default function Shopping() {
  const [modalCarrinhoVisivel, setModalCarrinhoVisivel] = useState(false);
  const [modalClienteVisivel, setModalClienteVisivel] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const { adicionarItem, removerItem, obterQuantidade } = useCarrinho();

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaSelecionada) {
      carregarProdutos(categoriaSelecionada.id);
    }
  }, [categoriaSelecionada]);

  async function carregarCategorias() {
    try {
      const response = await api.get('/categorias');
      const lista = response.data || [];
      setCategorias(lista);
      if (lista.length > 0) {
        setCategoriaSelecionada(lista[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  }

  async function carregarProdutos(categoriaId) {
    setCarregando(true);
    try {
      const response = await api.get(`/produtos?categoriaId=${categoriaId}`);
      setProdutos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }

  function renderCategoria({ item }) {
    const selecionada = categoriaSelecionada?.id === item.id;

    return (
      <TouchableOpacity
        style={styles.categoriaItem}
        activeOpacity={0.8}
        onPress={() => setCategoriaSelecionada(item)}
      >
        <View
          style={[
            styles.categoriaIcone,
            selecionada && styles.categoriaIconeSelecionado,
          ]}
        >
          <MaterialCommunityIcons
            name={ICONES_CATEGORIA[item.nome] || item.icone || 'food'}
            size={28}
            color={selecionada ? '#ffffff' : '#ea580c'}
          />
        </View>
        <Text
          style={[
            styles.categoriaNome,
            selecionada && styles.categoriaNomeSelecionado,
          ]}
        >
          {item.nome}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderProduto({ item }) {
    const quantidade = obterQuantidade(item.id);

    return (
      <View style={styles.produtoCard}>
        <Image
          source={{ uri: item.imagem || 'https://placehold.co/80x80' }}
          style={styles.produtoImagem}
          resizeMode="cover"
        />

        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoData}>Disponível agora</Text>
          <Text style={styles.produtoPreco}>
            R${Number(item.preco).toFixed(2)}
          </Text>
        </View>

        <View style={styles.quantidadeContainer}>
          {quantidade > 0 ? (
            <>
              <TouchableOpacity
                style={styles.qtyButton}
                activeOpacity={0.8}
                onPress={() => removerItem(item.id)}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={14}
                  color="#ea580c"
                />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{quantidade}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                activeOpacity={0.8}
                onPress={() => adicionarItem(item)}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={14}
                  color="#ea580c"
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.qtyButtonAdd}
              activeOpacity={0.8}
              onPress={() => adicionarItem(item)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <BackApp
      onCartPress={() => setModalCarrinhoVisivel(true)}
      onClientPress={() => setModalClienteVisivel(true)}
    >
      <View style={styles.container}>
        {/* CATEGORIAS */}
        <View style={styles.categoriasContainer}>
          <FlatList
            data={categorias}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategoria}
            contentContainerStyle={styles.categoriasLista}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>Nenhuma categoria</Text>
            }
          />
        </View>

        {/* TÍTULO DA CATEGORIA */}
        <Text style={styles.secaoTitulo}>
          {categoriaSelecionada?.nome || 'Produtos'}
        </Text>

        {/* PRODUTOS */}
        {carregando ? (
          <View style={styles.carregandoContainer}>
            <ActivityIndicator size="large" color="#ea580c" />
          </View>
        ) : (
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduto}
            contentContainerStyle={styles.produtosLista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
            }
          />
        )}
      </View>

      {/* MODAL DO CARRINHO */}
      <Modal
        visible={modalCarrinhoVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalCarrinhoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClickableArea}
            activeOpacity={1}
            onPress={() => setModalCarrinhoVisivel(false)}
          />
          <View style={styles.modalContent}>
            <ModalCarrinhoCompras
              onClose={() => setModalCarrinhoVisivel(false)}
              onConfirm={() => {
                setModalCarrinhoVisivel(false);
                setModalClienteVisivel(true); // Abre o modal de cliente logo em seguida!
              }}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL DE SELECIONAR CLIENTE */}
      <Modal
        visible={modalClienteVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalClienteVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClickableArea}
            activeOpacity={1}
            onPress={() => setModalClienteVisivel(false)}
          />
          <View style={styles.modalContent}>
            <ModalSelectCliente 
              onClose={() => setModalClienteVisivel(false)} 
            />
          </View>
        </View>
      </Modal>
    </BackApp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  categoriasContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoriasLista: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoriaItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoriaIcone: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaIconeSelecionado: {
    backgroundColor: '#ea580c',
  },
  categoriaNome: {
    fontSize: 12,
    color: '#78716c',
    fontWeight: '500',
  },
  categoriaNomeSelecionado: {
    color: '#ea580c',
    fontWeight: 'bold',
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1917',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  produtosLista: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  produtoImagem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e7e5e4',
  },
  produtoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1917',
    marginBottom: 4,
  },
  produtoData: {
    fontSize: 12,
    color: '#a8a29e',
    marginBottom: 8,
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    backgroundColor: '#ea580c',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonAdd: {
    width: 36,
    height: 36,
    backgroundColor: '#ea580c',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#ea580c',
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  vazioTexto: {
    textAlign: 'center',
    marginTop: 40,
    color: '#78716c',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalClickableArea: {
    width: '10%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: '90%',
    height: '100%',
  },
});
