import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure this library is installed
import { Alert } from 'react-native';
import Axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    // Check for empty fields and alert if any are empty
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Gagal', 'Semua field harus diisi!');
      return;
    }
  
    // Check if the passwords match
    if (password !== confirmPassword) {
      Alert.alert('Gagal', 'Password tidak cocok!');
      return;
    }
  
    // Create form data
    const formData = new FormData();
    formData.append('nama_user', fullName);
    formData.append('no_phone', phone);
    formData.append('password', password);
    formData.append('email', email);
  
    // Make the API call
    try {
      const response = await Axios.post(
        'http://heyiamhasan.com/porto/iprintNew/Api/registerBiasa',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      console.log(response.data);
  
      // Check response status
      if (response.data.status) {
        console.log(response.data)  
        Alert.alert('Berhasil', response.data.message);

        // Redirect to login after 2 seconds
        setTimeout(() => navigation.navigate('Login'), 2000);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Gagal',error);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Mari Mulai!</Text>
      <Text style={styles.subtitle}>Buat akun untuk maksimalkan pengalaman-mu bersama iPrint!</Text>
      
        {/* Inputs with Icons */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor={styles.input.placeholderTextColor}

            onChangeText={setFullName}
            value={fullName}
          />
        </View>
        
        {/* Repeat for other inputs */}
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nomor Handphone"
            placeholderTextColor={styles.input.placeholderTextColor}

            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={styles.input.placeholderTextColor}

            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={styles.input.placeholderTextColor}

            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Ulangi Password"
            placeholderTextColor={styles.input.placeholderTextColor}

            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Buat akun</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>Sudah memiliki akun? Masuk Disini</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#331864',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    alignSelf: 'center',
    marginBottom: 1,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7', // Or any other background color you prefer
  },
  inputContainer: {
    color: 'black', // Text color
    placeholderTextColor: '#A9A9A9', // A light grey color for placeholder text that will show up against a white background
  
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d000000d',
    paddingLeft: 15,
    marginBottom: 20,
    // marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    color: 'black', // Text color
    placeholderTextColor: '#A9A9A9', // A light grey color for placeholder text that will show up against a white background
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE', // This should be your app's theme color
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 20,
    color: '#6200EE',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
