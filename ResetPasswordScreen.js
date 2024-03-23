import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed

const ResetPasswordScreen = ({ navigation, route }) => {
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

    // TODO: Implement API call to reset password here
    // After the API call, navigate to the login screen or dashboard as appropriate

    try {
      // Assuming you have the API endpoint to reset the password
      const response = await Axios.post(
        '{{url}}/api/reset_password',
        {
          reset_pass_key: resetPassKey,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
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
  },
  input: {
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
