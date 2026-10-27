import { NavigationContainer } from '@react-navigation/native'; // npm install @react-navigation/native     npx expo install react-native-screens react-native-safe-area-context
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // npm install @react-navigation/native-stack
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // npm install @react-navigation/bottom-tabs
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from './src/components/NavBar';
import Login from './src/screens/Login';
import Shopping from './src/screens/Shopping';
import HistoryBuy from './src/screens/HistoryBuy';
import HistoryPay from './src/screens/HistoryPay';
import Create from './src/screens/Create';
import User from './src/screens/User';
import { CarrinhoProvider } from './src/context/CarrinhoContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// GRUPO DE TELAS COM A NAVBAR
function MainApp() {
  return (
    <CarrinhoProvider>
    <Tab.Navigator 
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavBar {...props} />} 
    >
      {/* Coloque aqui todas as telas que DEVEM ter a NavBar */}
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
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >

      <Stack.Screen 
        name='Login'
        component={Login}
        />

      <Stack.Screen 
        name='MainTabs' 
        component={MainApp}
      />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
