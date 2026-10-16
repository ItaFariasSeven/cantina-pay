import React, { useState } from 'react';
import {  View,  Text,  Image,  TouchableOpacity,  StyleSheet,  StatusBar, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
  // Controla qual visualização está ativa: 'initial' (botões), 'login' ou 'register'
  const [viewMode, setViewMode] = useState('initial');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#E95220" />
      
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          
          <Image 
            source={require('../../assets/images/logoCantinaPay.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.textSection}>
            <View style={styles.bottomSection}>
              <Text style={styles.subtitle}>
                Um cantinho de amor e de encher a barriga!
              </Text>
              
              <View style={styles.actionSection}>
                
                {/*  ESTADO 1: TELA INICIAL (BOTÕES)  */}
                {viewMode === 'initial' && (
                  <View style={styles.buttonsWrapper}>
                    <TouchableOpacity 
                      style={styles.emailButton} 
                      activeOpacity={0.8}
                      onPress={() => setViewMode('login')} // Muda para a tela de Login
                    >
                      <Text style={styles.emailButtonText}>Entre com E-mail</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
                      <Image 
                        source={require('../../assets/images/logoGoogle.png')} 
                        style={styles.googleIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/*  ESTADO 2 e 3: TELA DE LOGIN OU CADASTRO  */}
                {(viewMode === 'login' || viewMode === 'register') && (
                  <View style={styles.formWrapper}>
                    <View style={styles.inputsContainer}>
                      <TextInput 
                        style={styles.input} 
                        placeholder="Email"
                        placeholderTextColor="#ea580c"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      <TextInput 
                        style={styles.input} 
                        placeholder="Senha"
                        placeholderTextColor="#ea580c"
                        secureTextEntry // Esconde a senha com "pontinhos"
                      />
                    </View>

                    <TouchableOpacity 
                      style={styles.submitButton} 
                      activeOpacity={0.8}
                      onPress={() => {
                        if (viewMode === 'login') {
                          navigation.navigate('MainTabs'); // Nome da sua próxima tela
                        }
                      }}
                    >
                      <Text style={styles.submitButtonText}>
                        {viewMode === 'login' ? 'Entrar' : 'Cadastrar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* ---------- RODAPÉ DINÂMICO ---------- */}
                <Text style={styles.footerText}>
                  {viewMode === 'register' ? 'Já tem conta? ' : 'Ainda não tem conta? '}
                  <Text 
                    style={styles.footerLink}
                    onPress={() => setViewMode(viewMode === 'register' ? 'login' : 'register')}
                  >
                    {viewMode === 'register' ? 'Faça login' : 'Cadastre-se'}
                  </Text>
                </Text>

              </View>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E95220',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    top: '18%',
    backgroundColor: '#E95220',
  },
  contentWrapper: {
    width: 288,
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 256,
    height: 240,
  },
  textSection: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontFamily: 'Kavoon',
  },
  bottomSection: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    gap: 44,
  },
  subtitle: {
    color: '#fafaf9',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'League Spartan',
    textAlign: 'center',
    lineHeight: 16,
    alignSelf: 'stretch',
  },
  actionSection: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 44,
  },
  buttonsWrapper: {
    width: 224,
    alignItems: 'flex-start',
    gap: 20,
  },
  emailButton: {
    alignSelf: 'stretch',
    height: 40,
    backgroundColor: '#fef3c7', 
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 56,
    paddingVertical: 12,
    gap: 10,
  },
  emailButtonText: {
    color: '#ea580c', 
    fontSize: 12,
    fontFamily: 'Actor',
    letterSpacing: -0.2,
    lineHeight: 16,
  },
  googleButton: {
    alignSelf: 'stretch',
    height: 36,
    backgroundColor: '#fcd34d', 
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
    paddingRight: 40,
    paddingVertical: 8,
    gap: 10,
  },
  googleIcon: {
    width: 16,
    height: 16,
  },
  googleButtonText: {
    width: 128,
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SF Pro Display',
    letterSpacing: -0.2,
    lineHeight: 16,
  },
  footerText: {
    color: '#fafaf9',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'League Spartan',
    textAlign: 'center',
    lineHeight: 16,
    alignSelf: 'stretch',
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
  
  /* --- NOVOS ESTILOS DO FORMULÁRIO DE LOGIN/CADASTRO --- */
  formWrapper: {
    width: 224,
    flexDirection: 'column',
    gap: 5,
  },
  inputsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 5,
  },
  input: {
    alignSelf: 'stretch',
    height: 40,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    paddingHorizontal: 16, // Espaçamento interno para o texto não colar na borda
    color: '#ea580c',
    fontSize: 12,
    fontFamily: 'Actor',
  },
  submitButton: {
    alignSelf: 'stretch',
    height: 36,
    backgroundColor: '#fcd34d',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ea580c',
    fontSize: 24,
    fontFamily: 'Acme', // Lembre-se de importar e carregar essa fonte também!
  },
});
