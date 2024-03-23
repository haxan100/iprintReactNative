import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image, // Tambahkan ini
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Untuk FontAwesome
import Entypo from 'react-native-vector-icons/Entypo'; // Untuk Entypo\
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Untuk FontAwesome
import backgroundImage from './assets/images/bg.png';
import AlertNotification from 'react-native-alert-notification';
import CustomAlert from './utils/CustomAlert'; // Pastikan path ini sesuai dengan struktur direktori Anda
// import axios from 'axios';
import Axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({navigation}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [eyeIcon, setEyeIcon] = useState('eye-slash');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi untuk menangani aksi login
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
        url: 'http://heyiamhasan.com/porto/iprintNew/Api/loginbyEmail',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    
      console.log(response.data);
      if (response.data.status) {
        CustomAlert.showAlert('Login Berhasil', `Selamat Datang! 
        ${response.data.data.nama_user}`);

        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
    
        // Navigasi ke halaman Home
        // navigation.navigate('Home');
        // Simpan data ke sesi dan navigasi ke menu utama
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
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <Text style={styles.forgotPassword}>Lupa password?</Text>
        <Text style={styles.signUp}>Belum memiliki akun? Buat Disini</Text>
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
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  googleButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  orText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 15,
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
    shadowOffset: {height: 1, width: 0},
    elevation: 2,
    width: '100%',
  },
  eyeIcon: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white', // Background warna putih agar teks hitam terlihat
    color: 'black', // Warna teks
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginVertical: 10,
    shadowOpacity: 0.2, // Bayangan untuk iOS
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {height: 1, width: 0},
    elevation: 2, // Bayangan untuk Android
    width: '100%',
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
  signUp: {
    textAlign: 'center',
    color: 'white',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 200, // Atur lebar sesuai kebutuhan
    height: 100, // Atur tinggi sesuai kebutuhan
    resizeMode: 'contain', // Pastikan logo tidak terpotong
    alignSelf: 'center', // Taruh logo di tengah
    marginVertical: 20, // Tambahkan margin atas dan bawah
  },
});

export default LoginScreen;
