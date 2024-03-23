import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const PrintOnlyLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // Gambar dari halaman sebelumnya
  console.log(image)
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [duplikasiMotif, setDuplikasiMotif] = useState(false);

  const handleNext = () => {
    // Handle the next button press
    console.log("Lebar:", lebar);
    console.log("Panjang:", panjang);
    console.log("Duplikasi Motif:", duplikasiMotif);
    // Here you can do something with the values, like navigating to another screen or making an API call
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTop}>Print Only!</Text>
      <Text style={styles.header}>Cetak Kain Favorit-mu Sekarang!</Text>

      <TextInput
        style={styles.input}
        value={lebar}
        readOnly
        onChangeText={setLebar}
        placeholder="Lebar (m)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={panjang}
        onChangeText={setPanjang}
        placeholder="Panjang (m)"
        keyboardType="numeric"
        placeholderTextColor="#BDBDBD"

      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Selanjutnya</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerTop: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200EE',
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    color: '#000000',

  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrintOnlyLanjutanScreen;
