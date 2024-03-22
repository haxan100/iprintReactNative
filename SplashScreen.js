import React, { useEffect, useContext } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 200); // Pindah halaman setelah 2 detik
  }, [isAuthenticated, navigation]);

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
    width: 100, // Atur ukuran sesuai kebutuhan
    height: 100, // Atur ukuran sesuai kebutuhan
  },
});

export default SplashScreen;
