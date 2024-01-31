import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Splash() {
  const navigation = useNavigation();

  return (
    <LottieView
      source={require('../../assets/newsletter.json')}
      autoPlay
      loop={false}
      onAnimationFinish={() => navigation.navigate('Login')}
    />
  );
}
