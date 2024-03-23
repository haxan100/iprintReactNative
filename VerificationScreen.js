import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const VerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(route.params?.email || ''); // Retrieve the email passed from the previous screen

  useEffect(() => {
    // Here you might start a countdown timer for resending the verification code
  }, []);

  const handleVerification = async () => {
    // Validate the verification code
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    // Simulate an API call for code verification
    setTimeout(() => {
      // For the example, we assume the code is correct and navigate to the reset password screen
      Alert.alert('Success', 'Verification successful', [
        { text: 'OK', onPress: () => navigation.navigate('ResetPassword') },
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifikasi</Text>
      <Text style={styles.description}>
        Kami mengirimkan kode verifikasi ke {email}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setCode}
        value={code}
        placeholder="----"
        keyboardType="number-pad"
        maxLength={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Selanjutnya</Text>
      </TouchableOpacity>
    </View>
  );
};

// ... styles for VerificationScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;

