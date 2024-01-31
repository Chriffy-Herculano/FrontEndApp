import React, {useEffect, useState} from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {BASE_URL} from "../../Config";

export default function EntrarCliente({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEmailValid = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const goToRegister = () => {
        navigation.navigate('Cliente');
    }

    const getCSRFToken = async () => {
        try {
            const response = await fetch(`${BASE_URL}/csrf-token`);
            if (response.ok) {
                const csrfToken = await response.json();
                return csrfToken;
            } else {
                throw new Error('Falha ao obter o token CSRF');
            }
        } catch (error) {
            console.error('Erro ao obter o token CSRF:', error);
            throw error;
        }
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!email && !password) {
                setError('Email e senha são requeridos.');
                return;
            }
            if (!isEmailValid(email)) {
                setError('Email inválido! Por favor, digite um email válido.');
                return;
            }

            const csrfToken = await getCSRFToken();
            const response = await fetch(`${BASE_URL}/login/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.status === 200) { // Verifique o código de status 200
                const data = await response.json();
                const userId = data.customer_id; // Obtenha o ID da conta do cliente
                if (userId) {
                    // Login bem-sucedido
                    navigation.navigate('Listagem', {userId, csrfToken});
                } else {
                    // Algo deu errado ao obter o ID da conta do cliente
                    setError('Erro ao obter o ID da conta do cliente.');
                }
            } else {
                // Login falhou
                const data = await response.json();
                setError(data.msg || 'Erro desconhecido.');
            }
        } catch (error) {
            console.error('Ocorreu um erro durante o login:', error);
            setError('Ocorreu um erro durante o login.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topo}>
                <Image
                    source={require('../img/logo2.png')}
                    style={{width: 110, height: 110}}
                />
                <Text style={styles.logo}>MeuBico</Text>

                <Text style={styles.title}>Login Cliente</Text>
                <Text style={styles.subtitle}>
                    Entre e explore todas as vantagens do nosso aplicativo
                </Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="E-mail"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Senha"
                    secureTextEntry={true}
                    textContentType="password"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                {loading && <ActivityIndicator size="large" color="#1333cd" />}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={goToRegister}>
                <Text style={styles.toggleButtonText}>Criar sua conta no MeuBico</Text>
            </TouchableOpacity>
        </View>
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
    logo: {
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        fontSize: 40,
        color: '#1333cd',
        textAlign: 'center',
    },
    title: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
        // color: '#1333cd',
        color: '#000',
        textAlign: 'center',
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
        shadowOffset: {width: 0, height: 0},
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
