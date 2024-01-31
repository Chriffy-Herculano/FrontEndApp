import React, {useEffect, useState} from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity, ScrollView
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import {Camera} from "expo-camera";
import CameraPhoto from "./camera";
import axios from 'axios';
import { BASE_URL } from '../../Config';

export default function CompletarAutonomo({navigation, route}) {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const [tel, setTel] = useState('');
    const [gender, setGender] = useState('');
    const [description, setDescription] = useState('');
    const [estado, setEstado] = useState('');
    const [photo, setPhoto] = useState(null);
    const [city, setCity] = useState('');
    const [option, setOption] = useState(false);
    const { customerId } = route.params;
    const { csrfToken } = route.params;
    const { profileData } = route.params;
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    const carregarEstados = async () => {
        try {
            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
            setEstados(response.data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const carregarCidades = async (uf) => {
        try {
            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            setCidades(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    useEffect(() => {
        carregarEstados();
    }, []);


    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
    };

    const handleSubmit = async () => {
        try {
            const userData = {
                id: profileData ? profileData.id : null,
                id_usuario: customerId,
                nome_completo: username,
                idade: age,
                profissao: profession,
                genero: gender,
                telefone: tel,
                estado: estado,
                cidade: city,
                descricao: description,
                foto: photo,
            };

            const response = await axios.post(`${BASE_URL}/autonomo`, userData, { headers });

            if (response.status === 200) {

                navigation.navigate('Perfil', {customerId, csrfToken, photo});
            } else {
                console.error('Request failed:', response.data);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };


    const addPhoto = () => {
        navigation.navigate('Camera');
        setOption(false);
        // setPhoto(true);
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Remove todos os caracteres não numéricos do número de telefone
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Formata o número como (xx) x xxxx-xxxx
        const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        }

        // Retorna o número não formatado se não for possível formatar
        return cleaned;
    };

    const handleTelChange = (text) => {
        const formattedTel = formatPhoneNumber(text);
        setTel(formattedTel);
    };

    const carregarPhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setPhoto(result.uri);
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }

        setOption(false);
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
    }, []);

    const closeOption = () => {
        setOption(false);
    };

    useEffect(() => {
        if (profileData) {
            setUsername(profileData.nome_completo);
            setAge(profileData.idade);
            setProfession(profileData.profissao);
            setGender(profileData.genero);
            setTel(profileData.telefone);
            setEstado(profileData.estado);
            setCity(profileData.cidade);
            setDescription(profileData.descricao);
            if (profileData.foto) {
                setPhoto(profileData.foto);
            }
        }
    }, [profileData]);

    useEffect(() => {
        if (route.params && route.params.photoSaved) {
            setPhoto(route.params.photoSaved);
        }
    }, [route.params]);


    return (
        <ScrollView style={styles.container}>
            {option && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={closeOption}
                >
                    <View style={styles.option}>
                        <TouchableOpacity
                            style={styles.btnPhotos}
                            onPress={carregarPhoto}
                        >
                            <Text style={styles.btnText}>Carregar Imagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPhotos} onPress={addPhoto}>
                            <Text style={styles.btnText}>Tirar foto</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
            <View style={styles.topo}>
                <Text style={styles.title}>Complete seu cadastro</Text>
                {photo ?
                    <>
                        <Image style={{flex: 1, width: '100%', margin: 10, height: 300, borderRadius: 20}}
                               source={{uri: photo}}/>
                        <TouchableOpacity onPress={() => setOption(true)}>
                            <Text style={styles.btnText}>Trocar foto</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity onPress={() => setOption(true)}>
                        <Image
                            source={require('../img/profile.png')}
                            style={{width: 140, height: 140}}
                        />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.form}>
                <Text style={styles.subtitle}>
                    Nome completo
                </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Nome"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
                <View style={styles.inputContainer}>
                    <View style={styles.inputFlex}>
                        <Text style={styles.subtitle}>Idade</Text>
                        <TextInput
                            style={styles.inputIdade}
                            onChangeText={setAge}
                            value={age.toString()}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={styles.inputFlex}>
                        <Text style={styles.subtitle}>Profissão</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={profession}
                            onValueChange={(itemValue) => setProfession(itemValue)}
                        >
                            <Picker.Item label="Selecione uma opção" value=""/>
                            <Picker.Item label="Pintor" value="pintor"/>
                            <Picker.Item label="Eletricista" value="eletricista"/>
                            <Picker.Item label="Pedreiro" value="pedreiro"/>
                            <Picker.Item label="Faxineiro(a)" value="faxineiro"/>
                            <Picker.Item label="Cuidador(a)" value="cuidador"/>
                            <Picker.Item label="Encanador(a)" value="encanador"/>
                            <Picker.Item label="Piscineiro" value="piscineiro"/>
                            <Picker.Item label="Chaveiro" value="chaveiro"/>
                        </Picker>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    Gênero
                </Text>
                <Picker
                    style={styles.pickerGenero}
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                >
                    <Picker.Item label="Selecione uma opção" value=""/>
                    <Picker.Item label="Feminino" value="feminino"/>
                    <Picker.Item label="Masculino" value="masculino"/>
                    <Picker.Item label="Outro" value="outro"/>
                </Picker>
                <Text style={styles.subtitle}>
                    Telefone
                </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleTelChange}
                    value={tel}
                    placeholder="(xx) x xxxx-xxxx"
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                />
                <View style={styles.inputContainer}>
                    <View style={styles.inputFlex}>
                        <Text style={styles.subtitle}>Estado</Text>
                        <Picker
                            style={styles.pickerEstado}
                            selectedValue={estado}
                            onValueChange={(itemValue) => {
                                setEstado(itemValue);
                                // Quando o estado for alterado, carregue as cidades correspondentes
                                carregarCidades(itemValue);
                            }}
                        >
                            <Picker.Item label="Selecione uma opção" value="" />
                            {estados.map((e) => (
                                <Picker.Item key={e.sigla} label={e.sigla} value={e.sigla} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.inputFlex}>
                        <Text style={styles.subtitle}>Cidade</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={city}
                            onValueChange={(itemValue) => setCity(itemValue)}
                        >
                            <Picker.Item label="Selecione uma opção" value="" />
                            {cidades.map((c) => (
                                <Picker.Item key={c.id} label={c.nome} value={c.nome} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    Descrição
                </Text>
                <TextInput
                    style={styles.description}
                    onChangeText={setDescription}
                    value={description}
                    placeholder="Digite uma descrição"
                    multiline={true}
                    numberOfLines={4}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </View>
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
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 25,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
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
    picker: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: 250,
        padding: 12,
        marginVertical: 8,
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
        color: '#8c8b8b'
    },
    pickerGenero: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: '100%',
        padding: 12,
        marginVertical: 8,
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
        color: '#8c8b8b'
    },
    pickerEstado: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: 100,
        padding: 12,
        marginVertical: 8,
        marginRight: 20,
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
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
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
    },
    description: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: '100%',
        padding: 12,
        marginVertical: 8,
        boxSizing: 'border-box',
        height: 80,
        backgroundColor: '#f3f3fd',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputFlex: {
        flexDirection: 'column'
    },
    inputIdade: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: 100,
        padding: 12,
        marginVertical: 8,
        marginRight: 20,
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
    option: {
        position: "absolute",
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.68)',
        zIndex: 2000,
        height: '100%'
    },
    btnPhotos: {
        backgroundColor: '#fff',
        height: 66,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    btnText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent', // Make the overlay transparent
        zIndex: 1000, // Lower zIndex than the option view
    },
});