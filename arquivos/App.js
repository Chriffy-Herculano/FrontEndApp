import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Splash from './src/screens/splash';
import Title from './src/screens/title';
import Autonomo from './src/components/title/loginAutonomo';
import Cliente from './src/components/title/loginCliente';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterCliente from "./src/components/title/registerCliente";
import Entrar from "./src/components/title/registerCliente";
import EntrarCliente from "./src/components/title/registerCliente";
import EntrarAutonomo from "./src/components/title/registerAutonomo";
import CompletarAutonomo from "./src/components/title/completarAutonomo";
import CameraPhoto from "./src/components/title/camera";
import PerfilAutonomo from "./src/components/perfil/perfilAutonomo";
import Listagem from "./src/components/listagem/Listagem";
import Agenda from "./src/components/agenda/Agenda";
import VerAutonomo from "./src/components/perfil/verAutonomo";
import ListagemServicos from "./src/components/agenda/ListagemServicos";
import ListagemNotificacoes from "./src/components/agenda/ListagemNotificacoes";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={Splash} />
        <Stack.Screen
          name="Login"
          component={Title}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Agenda" component={Agenda} />
        <Stack.Screen name="Serviços" component={ListagemServicos} />
        <Stack.Screen name="Meus Serviços" component={ListagemNotificacoes} />
        <Stack.Screen name="Meus Pedidos" component={ListagemServicos} />
        <Stack.Screen name="Listagem" component={Listagem} />
        <Stack.Screen name="Perfil" component={PerfilAutonomo} />
        <Stack.Screen name="Perfil do Autonomo" component={VerAutonomo} />
        <Stack.Screen name="Camera" component={CameraPhoto} />
        <Stack.Screen name="Completar Cadastro" component={CompletarAutonomo} />
        <Stack.Screen name="Autonomo" component={Autonomo} />
        <Stack.Screen name="Cliente" component={Cliente} />
        <Stack.Screen name="Login Cliente" component={EntrarCliente} />
        <Stack.Screen name="Login Autonomo" component={EntrarAutonomo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
