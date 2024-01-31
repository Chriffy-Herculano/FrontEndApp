import React, { useEffect } from 'react';
import { View, Text, BackHandler, Button, StyleSheet } from 'react-native';

export default function Title({ navigation }) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);

  const handlePress1 = () => {
    navigation.navigate('Login Cliente');
  };

  const handlePress2 = () => {
    navigation.navigate('Login Autonomo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>O que você está procurando?</Text>
      <Button
        title="Estou em busca de um profissional!"
        onPress={handlePress1}
        color="#1333cd"
      />
      <View style={styles.space} />
      <Button
        title="Gostaria de oferecer meus serviços"
        onPress={handlePress2}
        color="#1333cd"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#1333cd',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  space: {
    height: 10,
  },
});

Title.navigationOptions = {
  headerShown: false,
};
