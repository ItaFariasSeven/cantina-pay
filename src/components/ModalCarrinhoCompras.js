import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
// 👇 AQUI ESTÁ A IMPORTAÇÃO CORRETA E ATUALIZADA:
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Feather } from '@expo/vector-icons';

export default function ModalCarrinhoCompras({ onClose, onConfirm }) {
  
  // Lista fictícia de pedidos. Adicione mais itens aqui para testar a rolagem!
  const pedidos = [
    { id: 1, nome: 'Burrito', data: '29/11/24', hora: '15:00', preco: 'R$12.00', qtd: 1, imagem: 'https://placehold.co/59x92' },
    { id: 2, nome: 'Burrito', data: '29/11/24', hora: '15:00', preco: 'R$12.00', qtd: 1, imagem: 'https://placehold.co/59x92' },
    { id: 3, nome: 'Burrito', data: '29/11/24', hora: '15:00', preco: 'R$12.00', qtd: 1, imagem: 'https://placehold.co/59x92' },
    { id: 4, nome: 'Taco', data: '29/11/24', hora: '15:15', preco: 'R$18.00', qtd: 2, imagem: 'https://placehold.co/59x92' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onClose} // Volta para a tela anterior
        >
          <Feather name="arrow-left" size={24} color="#ea580c" />
        </TouchableOpacity>
        <Text style={styles.title}>Carrinho</Text>
      </View>

      <Text style={styles.itemCountText}>Você tem {pedidos.length} itens em seu carrinho</Text>

      {/* ÁREA DE ROLAGEM DOS PEDIDOS */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {pedidos.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            
            {/* Imagem do Produto */}
            <Image source={{ uri: item.imagem }} style={styles.itemImage} />
            
            {/* Informações do Produto */}
            <View style={styles.itemDetails}>
              
              <View style={styles.itemRowTop}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.itemDate}>{item.data}</Text>
                  <Text style={styles.itemTime}>{item.hora}</Text>
                </View>
              </View>

              <View style={styles.itemRowBottom}>
                <Text style={styles.itemPrice}>{item.preco}</Text>
                
                {/* Botões de Quantidade [ - 1 + ] */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.qtyButton}>
                    <Feather name="minus" size={14} color="#ea580c" />
                  </TouchableOpacity>
                  
                  <Text style={styles.qtyText}>{item.qtd}</Text>
                  
                  <TouchableOpacity style={styles.qtyButton}>
                    <Feather name="plus" size={14} color="#ea580c" />
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </View>
        ))}
        
        {/* Espaço extra no final da lista para o botão não tampar o último item */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* RODAPÉ (Valor Manual, Total e Botão Confirmar) */}
      <View style={styles.footer}>
        
        <View style={styles.manualValueContainer}>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Valor Manual"
              placeholderTextColor="#78716c"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.totalText}>R$30.00</Text>
        </View>

        {/* BOTÃO QUE ENCAMINHA PARA A PRÓXIMA TELA */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={onConfirm} // Edite o nome da tela aqui depois!
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
  
  // CABEÇALHO
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

  // SCROLL DE PEDIDOS
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d', // Linha amarela separando (outline-amber-300)
    paddingVertical: 15,
  },
  itemImage: {
    width: 60,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#ccc', // fallback se não carregar
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    height: 80, // Mantém o texto alinhado com o tamanho da imagem
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
  itemTime: {
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
  
  // BOTÕES DE QUANTIDADE
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ea580c', // Fundo Laranja
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

  // RODAPÉ FIXO NA PARTE DE BAIXO
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#ea580c', // Mesma cor do fundo para mesclar
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
  
  // BOTÃO CONFIRMAR
  confirmButton: {
    backgroundColor: '#fcd34d', // bg-amber-300
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
  }
});
