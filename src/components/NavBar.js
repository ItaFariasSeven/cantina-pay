import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';



export default function NavBar({ state, navigation }) {

    const telaAtual = state.routes[state.index].name;

    const isShoppingAtivo = telaAtual === 'Shopping';
    const isHistoryBuyAtivo = telaAtual === 'HistoryBuy';
    const isHistoryPayAtivo = telaAtual === 'HistoryPay';
    const isCreateAtivo = telaAtual === 'Create';
    const isUserAtivo = telaAtual === 'User';

  return (
    <View style={styles.footerContainer}>
      
      {/* Botão 1 - Compras */}
      <TouchableOpacity 
        style={[
            styles.iconButton,
            isShoppingAtivo ? styles.botaoAtivo : null
        ]}
        onPress={() => navigation.navigate('Shopping')}
      >
        <Feather 
            name="shopping-cart" 
            size={24} 
            color={isShoppingAtivo ? '#000' : "#fafaf9"}
            style={isShoppingAtivo ? styles.iconWhithShadow : null}
        />
      </TouchableOpacity>

      {/* Botão 2 - Histórico de compras */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('HistoryBuy')}
      >
        <Ionicons 
            name="bag-outline" 
            size={24} 
            color={isHistoryBuyAtivo ? '#000' : "#fafaf9"}
            style={isHistoryBuyAtivo ? styles.iconWhithShadow : null}
        />
      </TouchableOpacity>

      {/* Botão 3 - Histórico de pagamentos */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('HistoryPay')}
      >
        <Octicons 
            name="checklist" 
            size={24} 
            color={isHistoryPayAtivo ? '#000' : "#fafaf9"}
            style={isHistoryPayAtivo ? styles.iconWhithShadow : null} 
        />
      </TouchableOpacity>

      {/* Botão 4 - Adicionar */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Create')}
      >
        <FontAwesome6 
            name="add" 
            size={24} 
            color={isCreateAtivo ? '#000' : "#fafaf9"}
            style={isCreateAtivo ? styles.iconWhithShadow : null}  
        />
      </TouchableOpacity>

      {/* Botão 5 - Perfil */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('User')}
      >
        <Feather 
            name="user" 
            size={24} 
            color={isUserAtivo ? '#000' : "#fafaf9"}
            style={isUserAtivo ? styles.iconWhithShadow : null} 
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 70, 
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center', 
    
    position: 'absolute',
    bottom: 0,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
},
iconButton: {
    padding: 20
},
iconWhithShadow:{
    textShadowColor: 'rgba(1, 1, 1, 1)', 
    textShadowOffset: { width: 2, height: 1 }, 
    textShadowRadius: 4, 
}
  }
);
