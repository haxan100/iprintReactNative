// Preview.js
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';

const PreviewScreen = ({ route, navigation }) => {
  const { image } = route.params;
  console.log("ada?")
  console.log("ada?",image)
  const changeImage = () => {
    // Function to handle changing the image
    navigation.goBack();
  };

  const Simpan = () => {
    navigation.navigate('PrintOnlyLanjutan', { image });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview</Text>
      <Image source={{ uri: image }} style={styles.image} />

      <TouchableOpacity style={styles.button} onPress={changeImage}>
        <Text style={styles.buttonText}>Change Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={Simpan}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for Preview
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200EE',
  },
  image: {
    width: '100%', // Adjust the size as needed
    height: 400, // Adjust the size as needed, could be dynamic
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PreviewScreen;
