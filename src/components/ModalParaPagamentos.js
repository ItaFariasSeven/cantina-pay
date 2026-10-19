import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';

export default function ModalParaPagamentos({ visible, compra, onClose, onPagar, onConfirmar }) {
  const [valorPagar, setValorPagar] = useState('');

  // Toda vez que o modal abrir (visible mudar para true), resetamos o campo de texto
  useEffect(() => {
    if (visible) {
      setValorPagar('');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} // Fecha no botão voltar nativo do Android
    >
      <View style={styles.modalOverlay}>
        
        {/* Clicar na área escura fecha o modal */}
        <TouchableOpacity 
          style={styles.modalClickableArea} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContent}>
          
          <Text style={styles.modalTitle}>Compra</Text>

          {/* FAIXA AMARELA COM OS DADOS DA COMPRA */}
          <View style={styles.detalhesCard}>
            <Text style={styles.detalhesNome}>{compra?.nomeAluno}</Text>
            <Text style={styles.detalhesPai}>{compra?.nomePai}</Text>
            
            <View style={styles.detalhesRow}>
              <Text style={styles.detalhesData}>{compra?.data}</Text>
              <Text style={styles.detalhesValor}>{compra?.valor}</Text>
            </View>
          </View>

          {/* INPUT DE VALOR A PAGAR */}
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.inputValor} 
              placeholder="Valor A Pagar"
              placeholderTextColor="#78716c"
              keyboardType="numeric"
              value={valorPagar}
              onChangeText={setValorPagar}
            />
          </View>

          {/* BOTÕES DE AÇÃO */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onPagar(valorPagar)} // Passa o valor digitado para a tela principal
          >
            <Text style={styles.actionButtonText}>Pagar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 15 }]}
            onPress={onConfirmar}
          >
            <Text style={styles.actionButtonText}>Confirmar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    left:'10%'
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // justifyContent: 'flex-end',
  },
  modalContent: {
    height: '104%',
    width: '90%',
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100,
    alignItems: 'center',
    paddingTop: 30,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detalhesCard: {
    width: '100%',
    backgroundColor: '#eab308', 
    paddingVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalhesNome: {
    color: '#707070',
    fontSize: 24,
    fontWeight: 'bold',
  },
  detalhesPai: {
    color: '#707070',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detalhesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 25,
  },
  detalhesData: {
    color: '#707070',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detalhesValor: {
    color: '#707070',
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputWrapper: {
    width: '65%',
    marginTop: 50,
    marginBottom: 40,
  },
  inputValor: {
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
  },
  actionButton: {
    backgroundColor: '#fcd34d', // bg-amber-300
    width: 150,
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
  actionButtonText: {
    color: '#ea580c', // text-orange-600
    fontSize: 20,
    fontWeight: 'bold',
  },
});
