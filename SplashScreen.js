import React, { useEffect, useContext } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import Axios from 'axios';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Ambil data sesi dari AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          // Jika ada data sesi, panggil API untuk validasi
          const response = await Axios.get(BASE_URL.BASE_URL+'getFotoProfile', {
            headers: {
              Authorization: `Bearer ${JSON.parse(userData).token}`,
            },
          });
          const { message, code, status } = response.data;
          if (status === false && message === 'Harap Login Terlebih Dahulu!') {
          await AsyncStorage.removeItem('userData');

            navigation.navigate('Login');
          } else {
            navigation.navigate('Home');
          }
        } else {
          // Jika tidak ada data sesi, navigasi ke halaman login
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to check login status', error);
        navigation.navigate('Login');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={{ uri: 'https://www.iprint.id/wp-content/uploads/2023/05/logo-iprint-blue.png' }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
