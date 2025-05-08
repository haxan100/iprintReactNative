import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import { CommonActions } from '@react-navigation/native';

const PrintOnlyLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // Gambar dari halaman sebelumnya
  console.log(image);
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [duplikasiMotif, setDuplikasiMotif] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handlePesanSekarang = () => {
    if(panjang==0||panjang==null){
      return alert("Mohon Isi Semua Yang Di Perlukan!")
    }
    navigation.navigate('CheckoutLive', { lebar, panjang, duplikasiMotif, deskripsi, image, tipe_kain:1,id_kain:0 });
    console.log('Pesan Sekarang dengan spesifikasix:', { lebar, panjang, duplikasiMotif, deskripsi });
  };

  const handleTambahKeKeranjang = async () => {
    console.log('tekan tambah ke keranjang');
    setLoadingText('Sedang Menambahkan Item Ke Keranjang');
    setLoading(true);
    const formData = new FormData();
    formData.append('tipe_kain', '1');
    formData.append('panjang', panjang);
    formData.append('catatan', deskripsi);
    formData.append('gambar', {
      uri: image,
      type: 'image/jpeg',
      name: 'gambar.jpg',
    });

    try {
      const response = await Axios({
        method: 'post',
        url: BASE_URL.BASE_URL+'addKeranjang',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);

      if (response.data.message === 'Harap Login Terlebih Dahulu!') {
        alert('Harap Login Terlebih Dahulu!');
        navigation.navigate('Login');
      }

      if (response.data.status) {
        console.log(response.data);
        Toast.show(response.data.message);
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Home' }, { name: 'Cart' }],
            })
          );
        }, 2000);
      } else {
        alert(response.data.message);
      }

      console.log('Response from addKeranjang API:', response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
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
      <TextInput
        style={styles.inputLarge}
        multiline
        numberOfLines={4}
        value={deskripsi}
        onChangeText={setDeskripsi}
        placeholder="Tuliskan Spesifikasi Panjang Kain-mu..."
        placeholderTextColor="#BDBDBD"
      />
      <TouchableOpacity style={styles.button} onPress={handlePesanSekarang}>
        <Text style={styles.buttonText}>Pesan Sekarang</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTambahKeKeranjang}>
        <Text style={styles.buttonText}>Tambahkan ke Keranjang</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
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
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 5,
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
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    color: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});

export default PrintOnlyLanjutanScreen;