import React, {useEffect, useState, useRef} from 'react';
import {
    StyleSheet,
    SafeAreaView, Text, View, TouchableOpacity, Modal, Image
} from 'react-native';
import {Camera} from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';

export default function CameraPhoto({navigation}) {

    const camRef = useRef(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [photoSaved, setPhotoSaved] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }

    if (hasPermission === false) {
        return <Text> Acesso negado! </Text>;
    }

    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            setCapturedPhoto(data.uri);
            // console.log(capturedPhoto);

            setOpen(true);
        }
    }


    async function savePicture() {
        setPhotoSaved(capturedPhoto);
        navigation.navigate('Completar Cadastro', { photoSaved: capturedPhoto });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Camera style={{flex: 1}} type={type} ref={camRef}>
                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                    <TouchableOpacity style={{position: 'absolute', bottom: 20, left: 20}}
                                      onPress={() => {
                                          setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
                                      }}

                    >
                        <Text style={{fontSize: 20, marginBottom: 13, color: '#FFF'}}>Trocar</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
                <FontAwesome name={"camera"} size={23} color={"#FFF"}/>
            </TouchableOpacity>
            {capturedPhoto &&
            <Modal animationType="slide" transparent={false} visible={open}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Image style={{flex: 1,  width: '100%', margin: 100, height: 300, borderRadius: 20 }} source={{ uri: capturedPhoto }} />
                    <View style={{ margin: 10, flexDirection: 'row' }}>
                      <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
                          <FontAwesome name="window-close" size={50} color="#FF0000" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ margin: 10 }} onPress={() => savePicture()}>
                          <FontAwesome name="upload" size={50} color="#121212" />
                      </TouchableOpacity>
                  </View>
                </View>
            </Modal>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        margin: 20,
        borderRadius: 10,
        height: 50,
    },
});

