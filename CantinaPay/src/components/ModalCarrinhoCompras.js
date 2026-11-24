import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCarrinho } from '../context/CarrinhoContext';
import api from '../api/api';

export default function ModalCarrinhoCompras({ onClose, onConfirm }) {
  const {
    itens,
    valorManual,
    setValorManual,
    total,
    adicionarItem,
    removerItem,
    setCompraPendenteId,
  } = useCarrinho();

  const [salvando, setSalvando] = useState(false);

  async function handleConfirmar() {
    if (itens.length === 0 && Number(valorManual) <= 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um produto ou um valor manual.');
      return;
    }
    // Se tiver itens, apenas fecha o carrinho e abre o próximo modal!
    onConfirm();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Feather name="arrow-left" size={24} color="#ea580c" />
        </TouchableOpacity>
        <Text style={styles.title}>Carrinho</Text>
      </View>

      <Text style={styles.itemCountText}>
        {itens.length === 0
          ? 'Seu carrinho está vazio'
          : `Você tem ${itens.length} item(s) em seu carrinho`}
      </Text>

      {/* LISTA DE ITENS */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {itens.map((item) => (
          <View key={item.produtoId} style={styles.itemContainer}>
            <Image
              source={{ uri: item.imagem || 'https://placehold.co/59x92' }}
              style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
              <View style={styles.itemRowTop}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.itemDate}>Hoje</Text>
                </View>
              </View>

              <View style={styles.itemRowBottom}>
                <Text style={styles.itemPrice}>
                  R${(item.precoUnitario * item.quantidade).toFixed(2)}
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => removerItem(item.produtoId)}
                  >
                    <Feather name="minus" size={14} color="#ea580c" />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantidade}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => adicionarItem(item)}
                  >
                    <Feather name="plus" size={14} color="#ea580c" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* RODAPÉ */}
      <View style={styles.footer}>
        <View style={styles.manualValueContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Valor Manual"
              placeholderTextColor="#78716c"
              keyboardType="numeric"
              value={valorManual > 0 ? valorManual.toString() : ''}
              onChangeText={(text) => {
                const valor = text.replace(',', '.');
                setValorManual(valor === '' ? 0 : Number(valor));
              }}
            />
          </View>
          <Text style={styles.totalText}>R${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#ea580c" />
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
    height: 80,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 50,
    width: 50,
    height: 40,
    backgroundColor: '#fafaf9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fafaf9',
    fontSize: 24,
    top: 10,
    fontWeight: 'bold',
  },
  itemCountText: {
    color: '#fafaf9',
    fontSize: 18,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d',
    paddingVertical: 15,
  },
  itemImage: {
    width: 60,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#ccc',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    height: 80,
  },
  itemRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    color: '#fafaf9',
    fontSize: 16,
    fontWeight: '600',
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  itemDate: {
    color: '#fafaf9',
    fontSize: 12,
  },
  itemRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    color: '#fafaf9',
    fontSize: 14,
    fontWeight: '300',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderColor: '#fafaf9',
    borderWidth: 1,
    borderRadius: 20,
    height: 30,
    width: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  qtyButton: {
    width: 20,
    height: 20,
    backgroundColor: '#fafaf9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#fafaf9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#ea580c',
    borderTopWidth: 1,
    borderTopColor: '#fcd34d',
  },
  manualValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  totalText: {
    color: '#fafaf9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#fcd34d',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#ea580c',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
