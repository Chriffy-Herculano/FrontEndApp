import React, {useEffect, useState} from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import filter from '../img/icons/filter.png';
import chaveiro from '../img/profissoes/chaveiro.png';
import cuidador from '../img/profissoes/cuidador.png';
import encanador from '../img/profissoes/ecanadorIcon.png';
import eletricista from '../img/profissoes/eletricistaIcon.png';
import faxineiro from '../img/profissoes/faxineiraIcon.png';
import jardineiro from '../img/profissoes/jardineiroIcon.png';
import pedreiro from '../img/profissoes/pedreiroIcon.png';
import pintor from '../img/profissoes/pintorIcon.png';
import piscineiro from '../img/profissoes/piscineiroIcon.png';
import {FontAwesome} from "@expo/vector-icons";
import {Picker} from "@react-native-picker/picker";
import {BASE_URL} from "../../Config";
import MenuCliente from "../componentes/menuCliente";

export default function Listagem({route, navigation}) {

    const [data, setData] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [profession, setProfession] = useState('');
    const [name, setName] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const {userId} = route.params;
    const {csrfToken} = route.params;

    const closeOption = () => {
        setOpenFilter(false);
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

    const clearFilters = () => {
        setProfession('');
        setName('');
        setOrderBy('');

        // Recarregue a lista completa (sem filtros)
        fetch(`${BASE_URL}/get-autonomo`)
            .then((response) => response.json())
            .then((responseData) => {
                setFilteredData(responseData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const handleFilter = () => {
        setLoading(true);
        const apiUrl = `${BASE_URL}/get-autonomo?profession=${profession}&name=${name}&orderBy=${orderBy}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((responseData) => {
                setFilteredData(responseData);
                setOpenFilter(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false regardless of success or failure
            });
    };

    const hasFilters = () => {
        return !!name || !!profession || !!orderBy;
    };

    useEffect(() => {
        fetch(`${BASE_URL}/get-autonomo`)
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData);
                setFilteredData(responseData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleProfileClick = (item) => {
        navigation.navigate('Perfil do Autonomo', {professionalData: item, userId, csrfToken});
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.list}>
                        {openFilter ? (
                            <View style={styles.overlay}>
                                <View style={styles.filterGroup}>
                                    <View style={styles.align}>
                                        <Text style={styles.titlePage}>Busque por um profissional</Text>
                                        <View style={styles.alignFilter}>
                                            <TouchableOpacity onPress={() => closeOption()}>
                                                <View style={styles.filterContainer}>
                                                    <FontAwesome name="window-close" size={20} color="#666"/>
                                                    <Text style={styles.profissao}>Fechar</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.subtitle}>
                                        Busque pelo nome
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={(text) => setName(text)}
                                        placeholder="Nome"
                                        autoCapitalize="none"
                                        keyboardType="name"
                                        textContentType="name"
                                    />
                                    <View style={styles.inputFlex}>
                                        <Text style={styles.subtitle}>Busque pela profissão</Text>
                                        <Picker
                                            style={styles.picker}
                                            selectedValue={profession}
                                            onValueChange={(itemValue) => setProfession(itemValue)}
                                        >
                                            <Picker.Item label="Selecione uma profissão" value=""/>
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
                                    <View style={styles.inputFlex}>
                                        <Text style={styles.subtitle}>Busque pela avaliação</Text>
                                        <Picker
                                            style={styles.picker}
                                            selectedValue={orderBy}
                                            onValueChange={(itemValue) => setOrderBy(itemValue)}
                                        >
                                            <Picker.Item label="Selecione uma opção" value=""/>
                                            <Picker.Item label="Ordenar pelo mais avaliado" value="maior"/>
                                            <Picker.Item label="Ordenar pelo menos avaliado" value="menor"/>
                                        </Picker>
                                    </View>
                                    {hasFilters() && (
                                        <TouchableOpacity style={styles.buttonClearOne} onPress={clearFilters}>
                                            <Text style={styles.buttonClear}>Limpar Filtros</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={styles.button} onPress={handleFilter}>
                                        <Text style={styles.buttonText}>Filtrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.align}>
                                <Text style={styles.titlePage}>Busque por um profissional</Text>
                                <View style={styles.alignFilter}>
                                    <TouchableOpacity onPress={() => setOpenFilter(true)}>
                                        <View style={styles.filterContainer}>
                                            <Image style={{width: 22, height: 22}} source={filter}/>
                                            <Text style={styles.profissao}>Filtrar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <View style={styles.list}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#1333cd" />
                            ) : (
                                <>
                                    {filteredData.map((item, index) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.box,
                                                index === filteredData.length - 1 ? { marginBottom: 70 } : null,
                                            ]}
                                            key={item.id}
                                            onPress={() => handleProfileClick(item)}
                                        >
                                            <Image
                                                source={profissaoImages[item.profissao]}
                                                style={styles.icon}
                                            />
                                            <View style={styles.content}>
                                                <Text style={styles.name}>{item.nome_completo}</Text>
                                                <Text>
                                                    Profissão:{" "}
                                                    <Text style={styles.span}>{item.profissao}</Text>
                                                </Text>
                                                <View style={styles.avaliation}>
                                                    {item.media_avaliacao > 0 ? (
                                                        Array.from({ length: item.media_avaliacao }).map(
                                                            (_, index) => (
                                                                <Image
                                                                    source={require('../img/icons/star.png')}
                                                                    style={styles.avaliationIcon}
                                                                    key={index}
                                                                />
                                                            )
                                                        )
                                                    ) : (
                                                        <Text style={styles.noAvaliation}>
                                                            Não possui avaliações
                                                        </Text>
                                                    )}
                                                    {item.media_avaliacao > 0 && (
                                                        <Text style={styles.numberAvaliation}>
                                                            (Média:{" "}
                                                            {(
                                                                Math.round(item.media_avaliacao * 10) / 10
                                                            ).toFixed(1)}
                                                            )
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <MenuCliente csrfToken={csrfToken} userId={userId} navigation={navigation}/>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 1000,
        padding: 18,
        paddingTop: 0
    },
    inputFlex: {
        flexDirection: 'column'
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
    buttonClearOne: {
        color: 'white',
        padding: 1,
        marginVertical: 8,
        borderWidth: 0,
        fontWeight: '600',
        borderRadius: 4,
        width: '100%',
        fontSize: 17
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    buttonClear: {
        color: '#666',
        textAlign: 'center',
    },
    picker: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: 375,
        padding: 12,
        marginVertical: 8,
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
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
    textFilter: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        color: '#333',
        marginRight: 10
    },
    filterGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    align: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titlePage: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: '#333',
        marginRight: 10
    },
    alignFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8e9eb',
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        justifyContent: 'space-around'
    },
    box: {
        flexDirection: 'row',
        padding: 15,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#2C2C2C',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        gap: 5,
    },
    name: {
        textTransform: 'capitalize',
    },
    span: {
        color: '#666666',
        textTransform: 'capitalize',
    },
    avaliation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avaliationIcon: {
        width: 20,
        height: 20,
    },
    numberAvaliation: {
        textTransform: 'capitalize',
        marginLeft: 8,
        fontSize: 14,
    },
});