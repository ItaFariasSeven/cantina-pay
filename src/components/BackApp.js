import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function BackApp({ children, title, showSearch = true, onCartPress, onClientPress }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcd34d" />
      
      {/* CABEÇALHO (Search e Botões) */}
      <View style={styles.headerRow}>
        {showSearch ? (
        <>
            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.searchInput}
                placeholder="Pesquisar"
                placeholderTextColor="#78716c" 
              />
            </View>
            
            {/* Botão de Ação 1 carrinho de compras */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onCartPress}>
              <MaterialIcons name="shopping-cart" size={30} color="#ea580c" />
            </TouchableOpacity>
            
            {/* Botão de Ação 2 Adiciona Usuário */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onClientPress}>
              <FontAwesome6 name="user-plus" size={25} color="#ea580c" />
            </TouchableOpacity>
        </>
        ) : (

        <View style={styles.containerMainTitleTop}>
            <View style={styles.containerTitleTop}>
                <Text style={styles.titleTop}>{title}</Text>
            </View>
        </View>
        )}
      </View>

      {/* RESTANTE DA TELA */}
      <View style={styles.content}>
        {children}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcd34d', 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingTop: 16,
    paddingBottom: 20,
    gap: 10, 
  },
  searchContainer: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 30,
    paddingLeft: 12,
    paddingRight: 6, 
},
searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333333',
  },
  searchCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 75,
    height: 52,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  placeholderText: {
    color: '#ea580c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerMainTitleTop:{
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTitleTop:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  titleTop: {
    width: '100%',
    textAlign: 'center', 
    color: '#fafaf9', 
    fontSize: 30, 
    fontWeight: 'bold', 
    textTransform: 'capitalize', 
    
    textShadowColor: 'rgba(0, 0, 0, 0.5)', 
    textShadowOffset: { width: 3, height: 3 }, 
    textShadowRadius: 1, 
  },
});
