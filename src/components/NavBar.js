import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      
      {/* Botão 1 - Home */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Shopping')}
      >
        <Feather name="home" size={24} color="#fafaf9" />
      </TouchableOpacity>

      {/* Botão 2 - Busca/Explorar */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Feather name="search" size={24} color="#fafaf9" />
      </TouchableOpacity>

      {/* Botão 3 - Ação Central */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Action')}
      >
        <Feather name="plus-square" size={24} color="#fafaf9" />
      </TouchableOpacity>

      {/* Botão 4 - Notificações */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Feather name="bell" size={24} color="#fafaf9" />
      </TouchableOpacity>

      {/* Botão 5 - Perfil */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Feather name="user" size={24} color="#fafaf9" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 64, // Equivalente ao h-16
    backgroundColor: '#ea580c', // Cor de fundo laranja
    borderTopLeftRadius: 30, // Arredondamento do topo esquerdo
    borderTopRightRadius: 30, // Arredondamento do topo direito
    flexDirection: 'row', // Alinha os ícones lado a lado
    justifyContent: 'space-evenly', // Distribui os ícones com espaçamento igual
    alignItems: 'center', // Centraliza verticalmente
    
    // Deixa o footer fixo na parte de baixo da tela
    position: 'absolute',
    bottom: 0,
    
    // Adiciona uma sombra leve para destacar (opcional, fica muito bom no mobile)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
  },
  iconButton: {
    padding: 10, // Aumenta a área de clique (hitbox) para facilitar o toque
  }
});
