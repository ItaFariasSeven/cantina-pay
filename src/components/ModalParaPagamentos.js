import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../api/api';

export default function ModalParaPagamentos({ visible, compra, dividaTotal, onClose, onSuccess }) {
  const [valorPagar, setValorPagar] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (visible) setValorPagar('');
  }, [visible]);

  const handleConfirmar = async () => {
    const valorNumerico = Number(valorPagar.replace(',', '.'));
    
    if (!valorPagar || isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      // Faz o pagamento desta compra específica no backend
      await api.post('/pagamentos', {
        compraId: compra.id,
        valor: valorNumerico
      });
      
      Alert.alert('Sucesso', 'Pagamento registrado com sucesso!');
      onSuccess(); // Recarrega a tela anterior e fecha o modal
    } catch (error) {
      console.error('Erro ao pagar:', error);
      Alert.alert('Erro', 'Não foi possível registrar o pagamento.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalClickableArea} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.modalContent}>
          
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Feather name="arrow-left" size={24} color="#ea580c" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Pagamento</Text>
          </View>

          {/* DADOS DA DÍVIDA E ALUNO */}
          <View style={styles.detalhesCard}>
            <Text style={styles.detalhesNome}>{compra?.cliente?.nomeAluno || 'Sem Nome'}</Text>
            <Text style={styles.detalhesPai}>{compra?.cliente?.nomePai || 'Sem Pai'}</Text>
            
            <View style={styles.detalhesDividaRow}>
              <Text style={styles.detalhesLabel}>Dívida Total:</Text>
              <Text style={styles.detalhesDivida}>R$ {Number(dividaTotal || 0).toFixed(2)}</Text>
            </View>
            
            <View style={styles.detalhesRow}>
              <Text style={styles.detalhesData}>Valor da Compra:</Text>
              <Text style={styles.detalhesValor}>R$ {Number(compra?.total || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* INPUT */}
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

          {/* BOTÕES */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleConfirmar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#ea580c" />
            ) : (
              <Text style={styles.actionButtonText}>Confirmar Pagamento</Text>
            )}
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

  },
  modalContent: { 
    height: '104%', 
    width: '90%', 
    backgroundColor: '#ea580c', 
    borderTopLeftRadius: 100, 
    alignItems: 'center', 
    paddingTop: 30 

  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 80, 
    position: 'relative' 
  },
  backButton: { 
    position: 'absolute', 
    top: 12, 
    right: '40%', 
    width: 50, 
    height: 40, 
    backgroundColor: '#fafaf9', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 

  },
  modalTitle: { 
    color: '#ffffff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginLeft: 30 

  },
  detalhesCard: { 
    width: '100%', 
    backgroundColor: '#eab308', 
    paddingVertical: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20 

  },
  detalhesNome: { 
    color: '#707070', 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center' 

  },
  detalhesPai: { 
    color: '#707070', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  detalhesDividaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 25, 
    paddingHorizontal: 10 
  },
  detalhesLabel: { 
    color: '#707070', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  detalhesDivida: { 
    color: '#dc2626', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  detalhesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 15, 
    paddingHorizontal: 10 
  },
  detalhesData: { 
    color: '#707070', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  detalhesValor: { 
    color: '#707070', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  inputWrapper: { 
    width: '65%', 
    marginTop: 50, 
    marginBottom: 40 
  },
  inputValor: { 
    backgroundColor: '#ffffff', 
    height: 45, 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#333333' 
  },
  actionButton: { 
    backgroundColor: '#fcd34d', 
    width: 220, 
    height: 45, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, height: 4 

    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },
  actionButtonText: { 
    color: '#ea580c', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
