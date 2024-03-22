import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logika untuk menangani login akan di sini
    // Misalnya memanggil API login
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://www.iprint.id/wp-content/uploads/2023/05/logo-iprint-blue.png' }} style={styles.logo} />
      <TouchableOpacity style={styles.googleButton}>
        <Text>Lanjutkan dengan Google</Text>
      </TouchableOpacity>
      <Text style={styles.orStyle}>Atau</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log in" onPress={handleLogin} />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Lupa password?</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.signUp}>Belum memiliki akun? Buat Disini</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  googleButton: {
    // Gaya untuk tombol Google
  },
  orStyle: {
    // Gaya untuk teks "Atau"
  },
  forgotPassword: {
    color: 'blue',
  },
  signUp: {
    color: 'blue',
  },
});

export default LoginScreen;
