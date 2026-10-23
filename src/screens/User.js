import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BackApp from '../components/BackApp';

export default function User({ onConfirm }) {
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

        {/* Saudação e e-mail */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.greetingText}>Olá, Fulano</Text>
          <Text style={styles.emailText}>fulano@gmail.com</Text>
        </View>

        {/* Campos de informações (somente leitura/visual) */}
        <View style={styles.fieldsContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome</Text>
            <View style={styles.inputField} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputField} />
          </View>
        </View>

        <TouchableOpacity 
            style={styles.confirmButton}
            onPress={onConfirm} // Edite o nome da tela aqui depois!
          >
            <Text style={styles.confirmButtonText}>Editar</Text>
        </TouchableOpacity>

        {/* Botão Continue with Google */}
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <Image 
            source={require('../../assets/images/logoGoogle.png')} 
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
    height: 40,
    backgroundColor: '#fef3c7', // amber-100
    borderRadius: 4,
  },
  inputLabel: {
    position: 'absolute',
    left: 12,
    top: 12,
    color: '#ea580c', 
    fontSize: 12,
    fontFamily: 'Actor',
    zIndex: 1,
  },
  googleButton: {
    width: 224,
    height: 36,
    backgroundColor: '#fcd34d', 
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  googleIcon: {
    width: 16,
    height: 16,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SF Pro Display',
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
  }
});
