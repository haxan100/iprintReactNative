import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // You can use any other icon library
import Axios from 'axios';
import { Alert } from 'react-native';
import BASE_URL from './config';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);


  const handleResetPassword = ({navigation}) => {
    // Implement your password reset logic here
    console.log('Password reset logic goes here.');
    updatePassword(currentPassword, newPassword, repeatPassword);

  };
  const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const formData = new FormData();
      formData.append('old_password', oldPassword);
      formData.append('password', newPassword);
      formData.append('re_password', confirmPassword);
  
      const response = await Axios({
        method: 'post',
        url: BASE_URL.BASE_URL+'ganti_password_menu', // Replace with your API endpoint
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      // Handle the response according to your needs
      console.log(response.data);
      if (response.data.status) {
        Alert.alert('Success', 'Password updated successfully.');
        setTimeout(() => {
          navigation.goBack();
        }, 1200);
      } else {
        Alert.alert('Error', response.data.message || 'An error occurred while updating the password.');
      }
    } catch (error) {
      console.error('Error updating password: ', error);
      Alert.alert('Error', 'An error occurred while updating the password.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };
  
  const toggleRepeatPasswordVisibility = () => {
    setIsRepeatPasswordVisible(!isRepeatPasswordVisible);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Ubah Password</Text>
      <Text style={styles.subtitle}>
        Masukkan kata sandi baru untuk akun anda agar anda dapat kembali mengakses fitur iPrint
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Password Lama"
          placeholderTextColor={'#A9A9A9'}
          // secureTextEntry={true}
          secureTextEntry={!isPasswordVisible} // If isPasswordVisible is true, secureTextEntry will be false, thus showing the password

        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
          <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#A9A9A9" />
        </TouchableOpacity>
        {/* <Icon name="eye-off" size={24} color="#A9A9A9" style={styles.icon} /> */}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Password Baru"
          secureTextEntry={!isNewPasswordVisible} // Toggle between true and false based on state
          placeholderTextColor={'#A9A9A9'}
        />
        <TouchableOpacity onPress={toggleNewPasswordVisibility} style={styles.icon}>
          <Icon name={isNewPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#A9A9A9" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          placeholder="Ulangi Password"
          secureTextEntry={!isRepeatPasswordVisible} // Toggle between true and false based on state
          placeholderTextColor={'#A9A9A9'}
        />
        <TouchableOpacity onPress={toggleRepeatPasswordVisibility} style={styles.icon}>
          <Icon name={isRepeatPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#A9A9A9" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3A0CA3',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',

  },
  subtitle: {
    fontSize: 16,
    color: '#696969',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#DCDCDC',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    color: '#000',

  },
  icon: {
    padding: 10,
  },
  resetButton: {
    backgroundColor: '#5D3FD3',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
