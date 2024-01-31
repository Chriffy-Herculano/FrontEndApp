import React, {useEffect, useState} from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity, ScrollView, Modal, ToastAndroid
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
import MenuAutonomo from "../componentes/menuAutonomo";
import MenuCliente from "../componentes/menuCliente";
import axios from "axios";

export default function ListagemServicos({route, navigation}) {

    const [openFilter, setOpenFilter] = useState(false);
    const [status, setStatus] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [hasServices, setHasServices] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [avaliacao, setAvaliacao] = useState('');
    const [avaliacaoModal, setAvaliacaoModal] = useState(false);

    const {userId} = route.params;
    const {csrfToken} = route.params;
    const handleClick = (service) => {
        setSelectedService(service);
        setIsModalDetail(true);
    };

    const closeModal = () => {
        setIsModalDetail(false);
    };

    const closeModalAvaliacao = () => {
        setAvaliacaoModal(false);
    };

    useEffect(() => {
        fetch(`${BASE_URL}/get-meus-pedidos?idCliente=${userId}`, {
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
                setData(data);
                setHasServices(data.length > 0); // Verifica se há serviços disponíveis
            })
            .catch((error) => {
                console.error('Error fetching notification count:', error);
            });
    }, []);

    const closeOption = () => {
        setOpenFilter(false);
    };

    const hasFilters = () => {
        return !!status;
    };

    const clearFilters = () => {
        setStatus('');

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
        const apiUrl = `${BASE_URL}/get-meus-servicos?idCliente=${userId}&statusFilter=${status}`;

        fetch(apiUrl, {
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
            .then((responseData) => {
                setData(responseData); // Atualize o estado 'data' com os serviços filtrados
                setOpenFilter(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };


    const servicesPendentes = data.filter(service => service.status === 'pendente');
    const servicesConcluidos = data.filter(service => service.status === 'concluído');
    const servicesEmProgresso = data.filter(service => service.status === 'em_progresso');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };

    const formatTime = (timeStr) => {
        const [hour, minute] = timeStr.split(':');
        const formattedHour = parseInt(hour, 10); // Certifique-se de que seja um número inteiro
        return `${formattedHour < 10 ? '0' : ''}${formattedHour}:${minute}`;
    };

    const avaliar = (idAutonomo) => {
        if (selectedService) {
            fetch(`${BASE_URL}/avaliacao?idCliente=${userId}&idAutonomo=${idAutonomo}&avaliacao=${avaliacao}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        closeModal();
                        closeModalAvaliacao();
                        fetch(`${BASE_URL}/get-meus-pedidos?idCliente=${userId}`)
                            .then((response) => response.json())
                            .then((responseData) => {
                                setData(responseData);
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            });
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch((error) => {
                    console.error('Error accepting service:', error);
                });
        }
    }

    const handleDeleteService = (idTarefa) => {
        if (selectedService) {
            fetch(`${BASE_URL}/deletar-agendamento/${idTarefa}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        closeModal();
                        fetch(`${BASE_URL}/get-meus-pedidos?idCliente=${userId}`)
                            .then((response) => response.json())
                            .then((responseData) => {
                                setData(responseData);
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            });
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch((error) => {
                    console.error('Error accepting service:', error);
                });
        }
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.list}>
                    {openFilter ? (
                        <View style={styles.overlay}>
                            <View style={styles.filterGroup}>
                                <View style={styles.align}>
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
                                <View style={styles.inputFlex}>
                                    <Text style={styles.subtitle}>Busque pelo status do serviço</Text>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={status}
                                        onValueChange={(itemValue) => setStatus(itemValue)}
                                    >
                                        <Picker.Item label="Selecione um status" value=""/>
                                        <Picker.Item label="Pendente" value="pendente"/>
                                        <Picker.Item label="Em progresso" value="em_progresso"/>
                                        <Picker.Item label="Concluído" value="concluido"/>
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
                </View>
                {servicesPendentes.length > 0 && (
                    <Text style={styles.titlePage}>Pedidos Pendentes</Text>
                )}
                {servicesPendentes.length === 0 && !hasServices && (
                    <Text style={styles.noServicesText}>Você não tem nenhum serviço solicitado</Text>
                )}
                <View style={styles.list}>
                    {servicesPendentes.map(service => (
                        <TouchableOpacity style={styles.box} key={service.id} onPress={() => handleClick(service)}>
                            <View style={styles.content}>
                                <Text>
                                    Cliente: <Text style={styles.span}>{service.nome_completo}</Text>
                                </Text>
                                <Text>
                                    Status: <Text style={styles.span}>{service.status}</Text>
                                </Text>
                                <Text>
                                    Data: <Text style={styles.span}>{formatDate(service.data)}</Text>
                                </Text>
                                <Text>
                                    Horário: <Text style={styles.span}>{formatTime(service.horario)}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {servicesEmProgresso.length > 0 && (
                    <Text style={styles.titlePage}>Pedidos em progresso</Text>
                )}
                <View style={styles.list}>
                    {servicesEmProgresso.map(service => (
                        <TouchableOpacity style={styles.progresso} key={service.id}
                                          onPress={() => handleClick(service)}>
                            <View style={styles.content}>
                                <Text>
                                    Cliente: <Text style={styles.span}>{service.nome_completo}</Text>
                                </Text>
                                <Text>
                                    Status: <Text
                                    style={styles.span}>{service.status === 'em_progresso' ? 'Em progresso' : service.status}</Text>
                                </Text>
                                <Text>
                                    Data: <Text style={styles.span}>{formatDate(service.data)}</Text>
                                </Text>
                                <Text>
                                    Horário: <Text style={styles.span}>{formatTime(service.horario)}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {servicesConcluidos.length > 0 && (
                    <Text style={styles.titlePage}>Pedidos Concluídos</Text>
                )}
                <View style={styles.list}>
                    {servicesConcluidos.map(service => (
                        <TouchableOpacity style={styles.concluido} key={service.id}
                                          onPress={() => handleClick(service)}>
                            <View style={styles.content}>
                                <Text>
                                    Cliente: <Text style={styles.span}>{service.nome_completo}</Text>
                                </Text>
                                <Text>
                                    Status: <Text style={styles.span}>{service.status}</Text>
                                </Text>
                                <Text>
                                    Data: <Text style={styles.span}>{formatDate(service.data)}</Text>
                                </Text>
                                <Text>
                                    Horário: <Text style={styles.span}>{formatTime(service.horario)}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <Modal visible={isModalDetail} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Serviço Solicitado</Text>
                            <TouchableOpacity style={styles.closeButtonX} onPress={closeModal}>
                                <Text style={styles.closeButtonXText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        {selectedService && (
                            <>
                                <View style={styles.modalGroup}>
                                    <Text style={styles.modalSubTitle}>
                                        <Text
                                            style={styles.subTitleBold}>Prestador :</Text> {selectedService.nome_completo}
                                    </Text>
                                    <Text style={styles.modalSubTitle}>
                                        <Text style={styles.subTitleBold}>Dia:</Text> {formatDate(selectedService.data)}
                                    </Text>
                                    <Text style={styles.modalSubTitle}>
                                        <Text
                                            style={styles.subTitleBold}>Horário:</Text> {formatTime(selectedService.horario)}
                                    </Text>
                                    <Text style={styles.modalSubTitle}>
                                        <Text style={styles.subTitleBold}>Descrição:</Text> {selectedService.descricao}
                                    </Text>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.buttonGreen}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.buttonText}>Confirmar</Text>
                                    </TouchableOpacity>
                                    {selectedService.status === 'pendente' ?
                                        <>
                                            <TouchableOpacity
                                                style={styles.buttonRed}
                                                onPress={() => handleDeleteService(selectedService.id)}
                                            >
                                                <Text style={styles.buttonText}>Cancelar Pedido</Text>
                                            </TouchableOpacity>
                                        </>
                                        : ''}
                                    {selectedService.status === 'concluído' ?
                                        <TouchableOpacity
                                            style={styles.buttonAvaliacao}
                                            onPress={() => setAvaliacaoModal(true)}
                                        >
                                            <Text style={styles.buttonText}>Avaliar Serviço</Text>
                                        </TouchableOpacity>
                                        : ''}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <Modal visible={avaliacaoModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Avalie esse serviço</Text>
                            <TouchableOpacity style={styles.closeButtonX} onPress={closeModalAvaliacao}>
                                <Text style={styles.closeButtonXText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        {selectedService && (
                            <View style={styles.modalGroupAvaliacao}>
                                <Picker
                                    style={styles.pickerAvaliacao}
                                    selectedValue={avaliacao}
                                    onValueChange={(itemValue) => setAvaliacao(itemValue)}
                                >
                                    <Picker.Item label="Nota 1 para o serviço" value={1.0}/>
                                    <Picker.Item label="Nota 2 para o serviço" value={2.0}/>
                                    <Picker.Item label="Nota 3 para o serviço" value={3.0}/>
                                    <Picker.Item label="Nota 4 para o serviço" value={4.0}/>
                                    <Picker.Item label="Nota 5 para o serviço" value={5.0}/>
                                </Picker>
                                <TouchableOpacity
                                    style={styles.buttonAvaliacaoModal}
                                    onPress={() => avaliar(selectedService.id_autonomo)}
                                >
                                    <Text style={styles.buttonText}>Confirmar avaliação</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            <MenuCliente csrfToken={csrfToken} userId={userId} navigation={navigation}/>
        </>
    );
}

const styles = StyleSheet.create({
    pickerAvaliacao: {
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'borderColor, boxShadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderRadius: 10,
        boxSizing: 'border-box',
        height: 50,
        backgroundColor: '#f3f3fd',
        color: '#8c8b8b'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalGroup: {
        paddingTop: 10,
        marginBottom: 20,
    },
    modalGroupAvaliacao: {
        paddingTop: 10,
        marginBottom: 20,
    },
    modalSubTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    subTitleBold: {
        fontWeight: '600',
    },
    modalTitle: {
        fontSize: 20,
        color: '#222',
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonGreen: {
        backgroundColor: '#1333cd',
        borderRadius: 12,
        color: '#000',
        borderWidth: 0,
        padding: 10,
        fontSize: 15,
        fontWeight: '700',
        width: '100%',
        marginBottom: 20
    },
    buttonRed: {
        backgroundColor: '#8c8b8b',
        borderRadius: 12,
        borderWidth: 0,
        width: '100%',
        padding: 10,
        fontSize: 15,
        fontWeight: '700',
    },
    buttonAvaliacao: {
        backgroundColor: '#fc8d00',
        borderRadius: 12,
        borderWidth: 0,
        width: '100%',
        padding: 10,
        fontSize: 15,
        fontWeight: '700',
    },
    buttonAvaliacaoModal: {
        marginTop: 10,
        backgroundColor: '#fc8d00',
        borderRadius: 12,
        borderWidth: 0,
        width: '100%',
        padding: 10,
        fontSize: 15,
        fontWeight: '700',
    },
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
        marginBottom: 45,
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
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 12,
        color: '#333',
    },
    alignFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8e9eb',
        padding: 10,
        marginTop: 20,
        marginBottom: 5,
        borderRadius: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        justifyContent: 'space-around'
    },
    box: {
        justifyContent: 'space-between',
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
    concluido: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 15,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6fdc03',
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
    progresso: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 15,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0340dc',
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
    noServicesText: {
        fontSize: 18,
        color: '#666', // Cor de texto desejada
        textAlign: 'center', // Centralizar o texto
        marginTop: 20, // Espaçamento superior para afastar do conteúdo anterior
    },
    closeButtonX: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
        borderRadius: 20,
        backgroundColor: '#0340dc',
    },
    closeButtonXText: {
        color: '#fff', // Text color
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});