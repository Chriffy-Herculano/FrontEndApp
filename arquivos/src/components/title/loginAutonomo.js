import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity, ScrollView,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from "../../Config";

export default function Autonomo({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const goToLogin = () => {
    navigation.navigate('Login Autonomo');
  }

  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        console.error('As senhas não coincidem.');
        return;
      }

      if (password.length < 6) {
        console.error('A senha deve conter pelo menos 6 caracteres.');
        return;
      }

      const emailExists = await axios.get(`${BASE_URL}/check-email?email=${email}`);

      if (emailExists.data.exists) {
        console.error('Este email já está em uso.');
        return;
      }

      // Obtenha o token CSRF do seu backend Laravel
      const csrf = await axios.get(`${BASE_URL}/csrf-token`);

      // Faça uma solicitação POST HTTP para seu backend com o token CSRF
      const response = await axios.post(
          `${BASE_URL}/register/customers`,
          {
            name: username,
            email,
            password,
          },
          {
            headers: {
              'X-CSRF-TOKEN': csrf.data,
            },
          }
      );

      if (response.data.success) {

        const loginResponse = await fetch(`${BASE_URL}/login/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf.data,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (loginResponse.status === 200) {
          const loginData = await loginResponse.json();
          const customerId = loginData.customer_id; // Obtain the customerId from loginData

          const csrfToken = csrf.data;

          navigation.navigate('Completar Cadastro', { customerId, csrfToken });
        } else {
          console.error('Ocorreu um erro durante o login:', loginResponse.data.msg || 'Erro desconhecido.');
        }
      } else {
        console.error('Ocorreu um erro durante o registro:', response.data.error);
      }
    } catch (error) {
      console.error('Ocorreu um erro durante o registro:', error);
      // Trate os erros, por exemplo, mostre uma mensagem de erro ao usuário
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);

  return (
      <ScrollView  style={styles.container}>
        <View style={styles.topo}>
          <Image
              source={require('../img/logo2.png')}
              style={{ width: 140, height: 140 }}
          />
          <Text style={styles.title}>Criar Conta Autônomo</Text>
          <Text style={styles.subtitle}>
            Crie uma conta para poder explorar todas as vantagens do nosso aplicativo
          </Text>
        </View>
        <View style={styles.form}>
          <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Nome"
          />
          <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Senha"
              secureTextEntry={true}
              textContentType="password"
          />
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirmar senha"
              secureTextEntry={true}
              textContentType="password"
          />
          {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={goToLogin}>
          <Text style={styles.toggleButtonText}>Já tenho uma conta</Text>
        </TouchableOpacity>
      </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
  },
  topo: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    color: '#1333cd',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  heading: {
    color: '#1333cd',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  error: {
    color: 'red',
  },
  input: {
    borderWidth: 2,
    borderColor: 'transparent',
    transitionProperty: 'borderColor, boxShadow',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-in-out',
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 11,
    boxSizing: 'border-box',
    height: 50,
    backgroundColor: '#f3f3fd',
  },
  button: {
    backgroundColor: '#1333cd',
    color: 'white',
    padding: 12,
    marginVertical: 8,
    borderWidth: 0,
    fontWeight: '600',
    borderRadius: 4,
    width: '100%',
    fontSize: 17,
    shadowColor: '#00000033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    // aqui você define o estilo do Text
  },
});
