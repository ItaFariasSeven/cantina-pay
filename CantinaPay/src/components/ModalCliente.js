import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../api/api';

export default function ModalCliente({ visible, onClose, onSuccess, clientes }) {
  const [tab, setTab] = useState('criar');
  const [nome, setNome] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [clienteEdit, setClienteEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSalvar() {
    if (!nome || !nomePai) {
      Alert.alert('Atenção', 'Preencha o nome do cliente e do pai/responsável.');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'criar') {
        await api.post('/clientes', { nomeAluno: nome, nomePai });
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      } else {
        if (!clienteEdit) {
          Alert.alert('Atenção', 'Selecione um cliente para editar.');
          setLoading(false);
          return;
        }
        await api.put(`/clientes/${clienteEdit.id}`, { nomeAluno: nome, nomePai });
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      }
      
      if (onSuccess) onSuccess();
      
      setNome('');
      setNomePai('');
      setClienteEdit(null);
      onClose(); // <-- Fecha aqui
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar os dados do cliente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalClickableArea} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>

          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Feather name="arrow-left" size={24} color="#ea580c" />
            </TouchableOpacity>
            <Text style={styles.modalMainTitle}>Clientes</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => { setTab('criar'); setClienteEdit(null); setNome(''); setNomePai(''); }}>
              <Text style={[styles.tabText, tab === 'criar' && styles.tabTextActive]}>Criar Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('editar')}>
              <Text style={[styles.tabText, tab === 'editar' && styles.tabTextActive]}>Editar</Text>
            </TouchableOpacity>
          </View>

          {tab === 'editar' && (
            <View style={styles.editSelectionContainer}>
              <Text style={styles.sectionLabel}>Selecione o Cliente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll} contentContainerStyle={{ paddingRight: 40 }}>
                {clientes?.map((cli) => (
                  <TouchableOpacity 
                    key={cli.id} 
                    style={[styles.clienteEditCard, clienteEdit?.id === cli.id && styles.iconCardActive]}
                    onPress={() => {
                      setClienteEdit(cli);
                      setNome(cli.nomeAluno);
                      setNomePai(cli.nomePai);
                    }}
                  >
                    <View style={styles.catIconCircleMini}>
                      <Feather name="user" size={20} color="#ea580c" />
                    </View>
                    <Text style={styles.catCardText} numberOfLines={1}>{cli.nomeAluno}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.modalSubtitle}>
            {tab === 'criar' ? 'Criar Novo Cliente' : 'Editar Dados'}
          </Text>

          <View style={[styles.inputsContainer, { marginTop: tab === 'criar' ? 40 : 10 }]}>
            <TextInput 
              style={styles.modalInput} 
              placeholder={tab === 'criar' ? "Nome" : "Nome do cliente"} 
              placeholderTextColor="#ea580c"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput 
              style={styles.modalInput} 
              placeholder={tab === 'criar' ? "Nome do Pai" : "Nome do pai"} 
              placeholderTextColor="#ea580c"
              value={nomePai}
              onChangeText={setNomePai}
            />
          </View>

          <TouchableOpacity style={[styles.confirmButton, { marginTop: 'auto' }]} onPress={handleSalvar} disabled={loading}>
            {loading ? <ActivityIndicator color="#ea580c" /> : <Text style={styles.confirmButtonText}>Confirmar</Text>}
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
  modalClickableArea: { 
    flex: 1 

  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 100, 
    position: 'relative' 

  },
  backButton: { 
    position: 'absolute', 
    top: 22, 
    right: '100%', 
    width: 50, 
    height: 40, 
    backgroundColor: '#fafaf9', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 

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
    marginBottom: 20 ,
    marginLeft: 20
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
    paddingLeft: '10%',
  },
  sectionLabel: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    alignSelf: 'flex-start', 
    paddingLeft: '10%', 
    marginBottom: 10 
  },
  editSelectionContainer: { 
    width: '100%', 
    marginBottom: 20 
  },
  iconScroll: { 
    maxHeight: 120, 
    paddingLeft: '10%' 
  },
  clienteEditCard: { 
    width: 80, 
    height: 90, 
    borderRadius: 10, 
    marginRight: 15, 
    backgroundColor: '#fef3c7', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 5 
  },
  catIconCircleMini: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 5 
  },
  catCardText: { 
    fontSize: 10, 
    color: '#333', 
    textAlign: 'center' 
  },
  iconCardActive: { 
    borderWidth: 3, 
    borderColor: '#ffffff' 
  },
  inputsContainer: { 
    width: '80%', 
    gap: 15 
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
    marginBottom: '30%', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0,
      height: 4 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },
  confirmButtonText: { 
    color: '#ea580c', 
    fontSize: 20, 
    fontWeight: 'bold' },
});