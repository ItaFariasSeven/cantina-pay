import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavBar from './src/components/NavBar';
import Login from './src/screens/Login';
import Shopping from './src/screens/Shopping';
import HistoryBuy from './src/screens/HistoryBuy';
import HistoryPay from './src/screens/HistoryPay';
import Create from './src/screens/Create';
import User from './src/screens/User';
import { CarrinhoProvider } from './src/context/CarrinhoContext';

// 1. CRIAMOS A REFERÊNCIA GLOBAL PARA USAR NO API.JS
export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp() {
  return (
    <CarrinhoProvider>
      <Tab.Navigator 
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <NavBar {...props} />} 
      >
        <Tab.Screen name="Shopping" component={Shopping} />
        <Tab.Screen name="HistoryBuy" component={HistoryBuy} />
        <Tab.Screen name="HistoryPay" component={HistoryPay} />
        <Tab.Screen name="Create" component={Create} />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
    </CarrinhoProvider>
  );
}

export default function App() {
  const [rotaInicial, setRotaInicial] = useState(null);

  useEffect(() => {
    async function verificarAcesso() {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
          setRotaInicial('MainTabs');
        } else {
          setRotaInicial('Login');
        }
      } catch (error) {
        setRotaInicial('Login');
      }
    }
    verificarAcesso();
  }, []);

  if (rotaInicial === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    // 2. CONECTAMOS A REFERÊNCIA AO CONTAINER DE NAVEGAÇÃO
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName={rotaInicial} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='MainTabs' component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  }
});