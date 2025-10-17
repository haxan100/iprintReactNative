import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FormData from 'form-data';
import Axios from 'axios';
import BASE_URL from './config';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    // Validate email
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

      try {
        // Membuat form data
        const formData = new FormData();
        formData.append('email', email);
    
        // Mengirim permintaan ke endpoint API
        const response = await Axios.post(
          BASE_URL.BASE_URL+'lupa_password',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
    
        // Mengecek respons dari server
        if (response.data.status) {
          console.log(response.data)
          console.log(response.data.data)
          // Jika status respons adalah true
          Alert.alert('Success', 'Silakan cek email Anda untuk kode verifikasi.', [
            
            { text: 'OK', onPress: () => {
              navigation.navigate('Verifikasi', {
                email: email,
                reset_pass_key: response.data.data.reset_pass_key, // Kirim resetPassKey ke halaman verifikasi
              });
            } },
          ]);
        } else {
          // Jika status respons adalah false atau terjadi kesalahan
          Alert.alert('Error', response.data.message || 'Gagal mengirimkan kode verifikasi.');
        }
      } catch (error) {
        // Menangani kesalahan jika permintaan gagal
        console.error('Forgot password error:', error);
        Alert.alert('Error', 'An error occurred during the forgot password process.');
      }

    // Here you would typically make an API request to your backend
    // For this example, let's assume the request is successful and navigate to the verification screen

    // Simulating an API call
    // setTimeout(() => {
    //   navigation.navigate('Verification', { email }); // Pass the email to the verification screen
    // }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password?</Text>
      <Text style={styles.description}>Masukkan email anda untuk melanjutkan proses verifikasi. Kami akan mengirimkan 4 digit kode ke email anda.</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Selanjutnya</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center', // Center the text
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center', // Center the text
  },
  input: {
    color: 'black', // Warna teks
    backgroundColor: '#f7f7f7', // A light background color for the input field
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd', // A subtle border color
  },
  button: {
    backgroundColor: '#6200EE', // This should be your app's theme color
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... other styles you may need
});

export default ForgotPasswordScreen;
