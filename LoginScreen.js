import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import backgroundImage from './assets/images/bg.png';
import AlertNotification from 'react-native-alert-notification';
import CustomAlert from './utils/CustomAlert';
import Axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        console.log(userData)
        if (userData) {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Error checking login status', error);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [eyeIcon, setEyeIcon] = useState('eye-slash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLupaPassword = () => {
    navigation.navigate('LupaPassword');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      CustomAlert.showAlert('Login Gagal', 'HARUS DI ISI SEMUA');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/loginbyEmail',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);
      if (response.data.status) {
        CustomAlert.showAlert('Login Berhasil', `Selamat Datang! ${response.data.data.nama_user}`);

        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));

        navigation.navigate('Home');
      } else {
        CustomAlert.showAlert('Login Gagal', `Gagal!! ${response.data.message}`);
      }
    } catch (error) {
      CustomAlert.showAlert('Login Gagal', `Gagal ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
    setEyeIcon(eyeIcon === 'eye' ? 'eye-slash' : 'eye');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://www.iprint.id/wp-content/uploads/2023/05/logo-iprint-blue.png',
          }}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#BDBDBD"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={passwordVisibility}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <FontAwesome name={eyeIcon} size={20} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUp} onPress={handleLupaPassword}>
          <Text style={styles.forgotPassword}>Lupa password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUp} onPress={handleRegister}>
          <Text style={styles.signUpText}>Belum memiliki akun? Buat Disini</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginVertical: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    elevation: 2,
    width: '100%',
  },
  eyeIcon: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginVertical: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    elevation: 2,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    color: 'black',

  },
  loginButton: {
    backgroundColor: '#E53935',
    borderRadius: 20,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  signUpText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default LoginScreen;
