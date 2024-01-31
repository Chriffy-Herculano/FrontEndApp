import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Modal} from 'react-native';

export default function MenuCliente({userId, csrfToken, navigation}) {
    const [isModal, setIsModal] = useState(false);


    const toggleModal = () => {
        setIsModal(!isModal);
    };

    const closeModal = () => {
        setIsModal(false);
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => navigation.navigate('Listagem', {userId, csrfToken})}
                                      style={styles.menuItem}>
                        <Text style={styles.menuText}>Início</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Meus Pedidos', {userId, csrfToken})}>
                        <Text style={styles.menuText}>Meus pedidos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleModal()} style={styles.menuItem}>
                        <Text style={styles.menuText}>Opções</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={isModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deseja encerrar a sessão?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.buttonGreen}
                                onPress={() => navigation.navigate('Login Cliente')}>
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonRed}
                                onPress={() => closeModal()}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1333cd',
        height: 50,
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        color: 'white', // Change text color to white
    },
    notificacaoContainer: {
        position: 'absolute',
        backgroundColor: 'red',
        top: -4,
        right: 3,
        borderRadius: 100,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    notificacaoText: {
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
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
    modalTitle: {
        fontSize: 20,
        color: '#222',
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 0,
        justifyContent: 'space-around',
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
    buttonText: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
        color: '#ffffff',
    },
});
