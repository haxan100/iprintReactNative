import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-simple-toast';
import { CommonActions } from '@react-navigation/native';
import BASE_URL from './config';

const PrintOnlyLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // image = 'file:///...'
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handlePesanSekarang = () => {
    if (panjang == 0 || panjang == null) {
      return alert('Mohon Isi Semua Yang Di Perlukan!');
    }
    navigation.navigate('CheckoutLive', { lebar, panjang, deskripsi, image, tipe_kain: 1, id_kain: 0 });
  };

  const handleTambahKeKeranjang = async () => {
    console.log('Menambahkan ke keranjang:', image);
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
      const response = await fetch(BASE_URL.BASE_URL + 'addKeranjang', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Response:', result);

      if (result.message === 'Harap Login Terlebih Dahulu!') {
        alert('Harap Login Terlebih Dahulu!');
        navigation.navigate('Login');
      } else if (result.status) {
        Toast.show(result.message);
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Home' }, { name: 'Cart' }],
            })
          );
        }, 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Terjadi kesalahan saat upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTop}>Print Only!</Text>
      <Text style={styles.header}>Cetak Kain Favorit-mu Sekarang!</Text>

      <TextInput style={styles.input} value={lebar} editable={false} placeholder="Lebar (m)" keyboardType="numeric" />
      <TextInput style={styles.input} value={panjang} onChangeText={setPanjang} placeholder="Panjang (m)" keyboardType="numeric" />
      <TextInput
        style={styles.inputLarge}
        multiline
        numberOfLines={4}
        value={deskripsi}
        onChangeText={setDeskripsi}
        placeholder="Tuliskan Spesifikasi Panjang Kain-mu..."
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
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  inputLarge: { borderWidth: 1, borderColor: 'grey', borderRadius: 5, marginBottom: 20, padding: 10, fontSize: 16, color: '#000', textAlignVertical: 'top' },
  headerTop: { textAlign: 'center', marginTop: 50, fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#6200EE' },
  header: { textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  input: { borderWidth: 1, borderColor: '#6200EE', borderRadius: 5, marginBottom: 20, padding: 10, fontSize: 16, color: '#000' },
  button: { backgroundColor: '#6200EE', padding: 15, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: 'white', marginTop: 10, fontSize: 16 },
});

export default PrintOnlyLanjutanScreen;
