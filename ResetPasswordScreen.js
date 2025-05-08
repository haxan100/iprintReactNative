import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed
import { BackHandler } from 'react-native';
import Axios from 'axios';
import FormData from 'form-data';

const ResetPasswordScreen = ({ navigation, route }) => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Error', 'Anda Tidak Dapat Kembali, Mohon tunggu Di Halaman ini.');
      // Ketika tombol kembali ditekan, tidak lakukan apa-apa, atau bisa juga memberikan peringatan.
      return true;  // Mengembalikan nilai `true` menandakan kita telah menangani back press.
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassKey, setResetPassKey] = useState(route.params?.reset_pass_key || '');
  const [id_user, setid_user] = useState(route.params?.id_user || '');
  console.log(route.params)
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    formData.append('reset_pass_key', resetPassKey);
    formData.append('id_user', id_user); // Make sure `id_user` is declared and assigned appropriately
    formData.append('password', newPassword);
    formData.append('re_password', confirmPassword);
  
    try {
      const response = await Axios.post(
        BASE_URL.BASE_URL+'ganti_password',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.data.status) {
        Alert.alert('Success', 'Your password has been reset.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Failed', response.data.message || 'Could not reset password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during password reset.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifikasi Berhasil!</Text>
      <Text style={styles.description}>
        Masukkan kata sandi baru untuk akun anda agar anda dapat kembali mengakses fitur iPrint
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="Password Baru"
          secureTextEntry
        />
        <Icon name="lock" size={20} color="#6e6e6e" style={styles.icon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Ulangi Password"
          secureTextEntry
        />
        <Icon name="lock" size={20} color="#6e6e6e" style={styles.icon} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
  title: {
    color: '#aae',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  input: {
    color: '#aae',
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginRight: 10,
  },
  icon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // ... other styles
});

export default ResetPasswordScreen;
