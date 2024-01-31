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
import {BASE_URL} from "../../Config";
import MenuAutonomo from "../componentes/menuAutonomo";
import chaveiro from "../img/profissoes/chaveiro.png";
import cuidador from "../img/profissoes/cuidador.png";
import encanador from "../img/profissoes/ecanadorIcon.png";
import eletricista from "../img/profissoes/eletricistaIcon.png";
import faxineiro from "../img/profissoes/faxineiraIcon.png";
import jardineiro from "../img/profissoes/jardineiroIcon.png";
import pedreiro from "../img/profissoes/pedreiroIcon.png";
import pintor from "../img/profissoes/pintorIcon.png";
import piscineiro from "../img/profissoes/piscineiroIcon.png";

export default function PerfilAutonomo({route, navigation}) {
    const [profileData, setProfileData] = useState(null);
    const [countNotifications, setCountNotifications] = useState(null);
    const {customerId} = route.params;
    const {csrfToken} = route.params;
    const {photo} = route.params;

    useEffect(() => {
        if (profileData) {
            fetch(`${BASE_URL}/get-notificacao?idAutonomo=${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setCountNotifications(data);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching notification count:', error);
                });
        }
    }, [profileData]);

    useEffect(() => {
        fetch(`${BASE_URL}/get-autonomo-perfil?customerId=${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProfileData(data);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });
    }, [customerId, route.params]);

    const handleEdit = async () => {
        navigation.navigate('Completar Cadastro', {customerId, profileData, csrfToken});
    };

    const profissaoImages = {
        chaveiro: chaveiro,
        cuidador: cuidador,
        encanador: encanador,
        eletricista: eletricista,
        faxineiro: faxineiro,
        jardineiro: jardineiro,
        pedreiro: pedreiro,
        pintor: pintor,
        piscineiro: piscineiro,
    };

    const professionImage = profileData ? profissaoImages[profileData.profissao] : null;

    return (
        <>
            <ScrollView style={styles.container}>
                {profileData ? (
                    <View>
                        <View style={styles.topo}>
                            {/*<Image style={{flex: 1, width: '100%', marginTop: 10, height: 350, borderRadius: 20}}*/}
                            {/*       source={{uri: photo}}/>*/}
                            {professionImage && (
                                <Image
                                    style={{ flex: 1, width: '100%', marginTop: 10, height: 380 }}
                                    // style={{ width: 100, height: 100 }} // Defina o tamanho desejado
                                    source={professionImage}
                                />
                            )}
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.btnEdit} onPress={handleEdit}>
                                <Image source={require('../img/icons/pencil-fill-circle.png')}/>
                                <Text style={styles.btnText}>Editar Perfil</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.all}>
                            <Text style={styles.title}>{profileData.nome_completo}, {profileData.idade}</Text>
                            <TouchableOpacity style={styles.starGroup}>
                                <View style={styles.alignStar}>
                                    {profileData.media_avaliacao > 0 ? (
                                        Array.from({length: profileData.media_avaliacao}).map((_, index) => (
                                            <Image style={{margin: 2, width: 15, height: 18}}
                                                   source={require('../img/icons/star.png')}/>
                                        ))
                                    ) : (
                                        <Text style={styles.noAvaliation}>Não possui avaliações</Text>
                                    )}
                                </View>
                                {profileData.media_avaliacao > 0 && (
                                    <Text style={styles.starText}>
                                        (Média: {(Math.round(profileData.media_avaliacao * 10) / 10).toFixed(1)})
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alignInfo}>
                                <Image style={{width: 15, height: 18}} source={require('../img/icons/building.png')}/>
                                <Text style={[styles.profissao, {textTransform: 'capitalize'}]}>
                                    Profissão: {profileData.profissao}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alignInfo}>
                                <Image style={{width: 15, height: 18}} source={require('../img/icons/gender.png')}/>
                                <Text style={[styles.profissao, {textTransform: 'capitalize'}]}>
                                    Gênero: {profileData.genero}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alignInfo}>
                                <Image style={{width: 15, height: 18}} source={require('../img/icons/gps.png')}/>
                                <Text style={[styles.profissao, {textTransform: 'capitalize'}]}>
                                    Cidade: {profileData.cidade} - {profileData.estado}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.descricaoTitleText}>
                                Sobre mim
                            </Text>
                            <View style={styles.descricaoBox}>
                                <Text style={styles.descricao}>{profileData.descricao}</Text>
                            </View>
                        </View>
                    </View>
                ) : null}
            </ScrollView>
            <MenuAutonomo csrfToken={csrfToken} customerId={customerId} navigation={navigation} countNotifications={countNotifications}/>
        </>
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
    info: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 70,
    },
    title: {
        fontSize: 25,
        fontWeight: "normal",
        color: '#666',
    },
    all: {
        padding: 15,
        alignItems: 'flex-start',
        color: '#666',
    },
    profissao: {
        fontSize: 20,
        fontWeight: "normal",
        color: '#666',
        paddingLeft: 10,
    },

    descricaoTitleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#666',
    },
    descricaoBox: {
        minHeight: 45,
        color: '#666',
    },
    descricao: {
        fontSize: 16,
        color: '#666',
    },
    alignInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
    },
    alignStar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4
    },
    starGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    starText: {
        paddingLeft: 5,
        fontSize: 14,
        color: '#666',
    },
    buttons: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        paddingBottom: 0,
    },
    btnEdit: {
        marginBottom: 15,
        width: '100%',
        height: 46,
        borderRadius: 8,
        backgroundColor: '#1333cd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        fontSize: 16,
        marginLeft: 6,
        color: '#fff',
    }
});