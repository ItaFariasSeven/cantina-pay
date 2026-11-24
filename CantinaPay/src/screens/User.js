import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BackApp from '../components/BackApp';
import api from '../api/api'; // Importação da API para conectar com o backend

export default function User({ navigation, onConfirm }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controla se os campos estão travados ou livres

  // useFocusEffect recarrega os dados TODA VEZ que a tela ganha foco (ao clicar na aba)
  useFocusEffect(
    useCallback(() => {
      async function loadUserData() {
        try {
          const storedNome = await AsyncStorage.getItem('@userName');
          const storedEmail = await AsyncStorage.getItem('@userEmail');
          
          if (storedNome) setNome(storedNome);
          if (storedEmail) setEmail(storedEmail);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }
      loadUserData();
    }, [])
  );

  // Função para salvar no banco de dados
  const handleUpdate = async () => {
    try {
      // Faz a requisição PUT para o backend
      await api.put('/auth/atualizar', { nome, email });
      
      // Atualiza também na memória do celular para não perder ao fechar o app
      await AsyncStorage.setItem('@userName', nome);
      await AsyncStorage.setItem('@userEmail', email);
      
      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
      setIsEditing(false); // Trava os campos novamente após salvar
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível atualizar os dados.');
    }
  };

  // Função para deslogar do app
  const handleLogout = async () => {
    await AsyncStorage.clear(); // Limpa token e todos os dados
    if (navigation) {
      // O getParent() puxa a navegação principal, saindo das abas!
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <BackApp showSearch={false} title="Usuário">
      <View style={styles.contentWrapper}>
        
        {/* Ícone de grid/quadrados no canto superior direito */}
        <View style={styles.gridIconContainer}>
          <View style={styles.gridIcon}>
            <View style={styles.gridRow}>
              <View style={styles.gridSquare} />
              <View style={styles.gridSquare} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridSquare} />
              <View style={styles.gridSquare} />
            </View>
          </View>
        </View>

        {/* Saudação e e-mail Dinâmicos */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.greetingText}>Olá, {nome ? nome.split(' ')[0] : 'Usuário'}</Text>
          <Text style={styles.emailText}>{email || 'Carregando...'}</Text>
        </View>

        {/* Campos de informações preenchidos dinamicamente */}
        <View style={styles.fieldsContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput 
              style={[styles.inputField, isEditing && styles.inputFieldEditing]} 
              value={nome}
              onChangeText={setNome} // Permite digitar novo nome
              editable={isEditing} // Só deixa digitar se isEditing for true
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput 
              style={[styles.inputField, isEditing && styles.inputFieldEditing]} 
              value={email}
              onChangeText={setEmail} // Permite digitar novo email
              editable={isEditing} // Só deixa digitar se isEditing for true
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Botão Editar / Salvar */}
        <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
              if (isEditing) {
                handleUpdate(); // Se estava editando, salva
              } else {
                setIsEditing(true); // Se não estava, libera para edição
              }
            }} 
          >
            <Text style={styles.confirmButtonText}>
              {isEditing ? 'Salvar' : 'Editar'}
            </Text>
        </TouchableOpacity>

        {/* Botão Sair da Conta */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#ea580c" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </View>
    </BackApp>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  gridIconContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 30,
  },
  gridIcon: {
    width: 42,
    height: 42,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridSquare: {
    width: 20,
    height: 20,
    backgroundColor: '#fcd34d', 
    borderRadius: 3,
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greetingText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  emailText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  fieldsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 10,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
  },
  inputField: {
    width: '100%',
    height: 45,
    backgroundColor: '#fef3c7', 
    borderRadius: 4,
    paddingTop: 15,
    paddingLeft: 12,
    color: '#ea580c',
    fontWeight: 'bold',
  },
  // Estilo novo que aplica fundo branco e borda quando clicamos em Editar
  inputFieldEditing: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ea580c',
  },
  inputLabel: {
    position: 'absolute',
    left: 12,
    top: 5,
    color: '#ea580c', 
    fontSize: 12,
    fontFamily: 'Actor',
    zIndex: 1,
  },
  confirmButton: {
    backgroundColor: '#fcd34d',
    height: 40,
    width: '50%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 15,
  },
  confirmButtonText: {
    color: '#ea580c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: 224,
    height: 40,
    backgroundColor: '#fcd34d', 
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#ea580c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
