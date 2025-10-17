import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BackHandler } from 'react-native';
import Axios from 'axios';
import FormData from 'form-data';

const VerificationScreen = ({ navigation, route }) => {
  console.log(route.params)
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState(route.params?.email || '');
  const [resetPassKey, setResetPassKey] = useState(route.params?.reset_pass_key || '');

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerification = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('reset_pass_key', resetPassKey);
      formData.append('kode_otp', code);    
        const response = await Axios.post(
          'https://heyiamhasan.com/porto/iprintNew/api/check_kode_otp',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(response)
      if (response.data.status) {
        console.log(response)
        Alert.alert('Verifikasi Berhasil', 'Kode verifikasi berhasil diverifikasi.');
        navigation.navigate('ResetPassword', { 
          reset_pass_key: response.data.data.reset_pass_key,
          id_user: response.data.data.id_user,

         });

        // Jika verifikasi berhasil
        // ... lakukan tindakan selanjutnya, misal navigasi atau update state
      } else {
        Alert.alert('Verifikasi Gagal', response.data.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'An error occurred during verification.');
    }
  };

  // ... JSX dan styles



  const resendCode = async () => {
    // Implementation of resend code logic
    setCountdown(30); // Reset countdown
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Error', 'Anda Tidak Dapat Kembali, Mohon tunggu Di Halaman ini.');
      // Ketika tombol kembali ditekan, tidak lakukan apa-apa, atau bisa juga memberikan peringatan.
      return true;  // Mengembalikan nilai `true` menandakan kita telah menangani back press.
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, []);

  // If countdown reaches zero, reset it to 30 and enable the resend option
  useEffect(() => {
    if (countdown === 0) {
      // Enable resend button and other relevant actions
    }
  }, [countdown]);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Kami mengirimkan kode verifikasi ke</Text>
      <Text style={styles.emailText}>{email}</Text>
      <Text style={styles.infoText}>Demi keamanan-mu, jangan berikan kode pada siapa pun.</Text>
      
      <TextInput
        style={styles.codeInput}
        onChangeText={setCode}
        value={code}
        placeholder="----"
        keyboardType="number-pad"
        maxLength={4}
        autoFocus
      />
      
      <TouchableOpacity onPress={resendCode} disabled={countdown !== 0}>
        <Text style={styles.resendText}>
          Kirim ulang kode dalam {countdown.toString().padStart(2, '0')} detik
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Selanjutnya</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#666',

    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  codeInput: {
    fontSize: 22,
    color: '#666',

    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
  },
  resendText: {
    color: '#6200EE',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;