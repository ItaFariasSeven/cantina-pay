import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ModalProduto({ visible, onClose }) {
  const [tab, setTab] = useState('criar');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  
  const imagens = ['https://placehold.co/74x107', 'https://placehold.co/74x107/png', 'https://placehold.co/74x107/orange'];
  const [imagemSelecionada, setImagemSelecionada] = useState(imagens[0]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalClickableArea} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>

          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onClose} // Volta para a tela anterior
              >
              <Feather name="arrow-left" size={24} color="#ea580c" />
            </TouchableOpacity>
            <Text style={styles.modalMainTitle}>Produto</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setTab('criar')}>
              <Text style={[styles.tabText, tab === 'criar' && styles.tabTextActive]}>Criar Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('editar')}>
              <Text style={[styles.tabText, tab === 'editar' && styles.tabTextActive]}>Editar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            {tab === 'criar' ? 'Crie Uma Nova Imagem' : 'Editar Imagem'}
          </Text>

          <Text style={styles.sectionLabel}>Selecione Uma Imagem</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
            {imagens.map((img, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.imageCard, imagemSelecionada === img && styles.iconCardActive]}
                onPress={() => setImagemSelecionada(img)}
              >
                <Image source={{ uri: img }} style={styles.imageCardImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputsContainer}>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Nome" 
              placeholderTextColor="#ea580c"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput 
              style={styles.modalInput} 
              placeholder="Valor" 
              placeholderTextColor="#ea580c"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    left: '10%' 
    // backgroundColor: 'rgba(0,0,0,0.5)', 
    // justifyContent: 'flex-end' 
  },
  modalClickableArea: { 
    flex: 1 

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    position: 'relative',
  },
  backButton:{
    position: 'absolute',
    top: '22%',
    right: '40%',
    width: 50,
    height: 40,
    backgroundColor: '#fafaf9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: { 
    height: '104%', 
    width: '90%', 
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100, 
    alignItems: 'center', 
    paddingTop: 30 
  },
  modalMainTitle: { 
    color: '#ffffff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  tabContainer: { 
    flexDirection: 'row', 
    width: '80%', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#fcd34d', 
    paddingBottom: 10, 
    marginBottom: 25 
  },
  tabText: { 
    color: '#ffffff', 
    fontSize: 20, 
    fontWeight: '500', 
    opacity: 0.6 
  },
  tabTextActive: { 
    fontWeight: 'bold', 
    opacity: 1 
  },
  modalSubtitle: { 
    color: '#ffffff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    alignSelf: 'flex-start', 
    paddingLeft: '10%' 
  },
  sectionLabel: { 
    color: '#ffffff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    alignSelf: 'flex-start', 
    paddingLeft: '10%', 
    marginTop: 20, 
    marginBottom: 15 
  },
  iconScroll: { 
    maxHeight: 120, 
    paddingLeft: '10%' 
  },
  imageCard: { 
    width: 80, 
    height: 110, 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginRight: 15 
  },
  imageCardImage: { 
    width: '100%', 
    height: '100%' 
  },
  iconCardActive: { 
    borderWidth: 2, 
    borderColor: '#ffffff' 
  },
  inputsContainer: { 
    width: '80%', 
    gap: 15, 
    marginTop: 20 
  },
  modalInput: { 
    backgroundColor: '#fef3c7', 
    height: 45, 
    borderRadius: 5, 
    paddingHorizontal: 20, 
    fontSize: 16, 
    color: '#ea580c' 
  },
  confirmButton: { 
    backgroundColor: '#fcd34d', 
    width: 150, 
    height: 45, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 'auto', 
    marginBottom: 40, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },
  confirmButtonText: { 
    color: '#ea580c', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
});
