// import { Axios } from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Axios from 'axios';

const PrintOnlyLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // Gambar dari halaman sebelumnya
  console.log(image)
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [duplikasiMotif, setDuplikasiMotif] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');

  const handleNext = () => {
    // Handle the next button press
    console.log("Lebar:", lebar);
    console.log("Panjang:", panjang);
    console.log("Duplikasi Motif:", duplikasiMotif);
    // Here you can do something with the values, like navigating to another screen or making an API call
  };
  const handlePesanSekarang = () => {
    // Handle pesan sekarang action
    
    navigation.navigate('Checkout',{ lebar, panjang, duplikasiMotif, deskripsi });    
    console.log("Pesan Sekarang dengan spesifikasix:", { lebar, panjang, duplikasiMotif, deskripsi });
    // Implementasi fungsi pesan sekarang
  };

  const handleTambahKeKeranjang = async () => {
    const formData = new FormData();
    formData.append('tipe_kain', '1');
    // formData.append('id_kain', '11');
    formData.append('panjang', panjang);
    formData.append('catatan', deskripsi);
    // Pastikan `image` adalah file atau URI gambar yang valid
    // Jika `image` adalah URI, Anda mungkin perlu mengubahnya menjadi blob atau file terlebih dahulu
    // Contoh di bawah ini mengasumsikan `image` sudah dalam bentuk yang tepat untuk dikirim
    formData.append('gambar', {
      uri: image,
      type: 'image/jpeg', // atau tipe file yang sesuai
      name: 'gambar.jpg', // atau nama file yang sesuai
    });
  
    try {
      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/addKeranjang', // Ganti dengan URL yang sesuai
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("==============>>")
      console.log(response.data)
      
      if (response.data.message === "Harap Login Terlebih Dahulu!") {
        alert('Harap Login Terlebih Dahulu!');
        navigation.navigate('Login');
      } else {
        alert(response.data.message);
      }

      console.log("==============>>")
      if(response.data.status){
        console.log(response.data)
        alert('Berhasil menambahkan ke keranjang')
        setTimeout(() => {
          navigation.navigate('Cart');
          
        }, 2000);
      }else{
        alert(response.data.message )
      }

  
      console.log("Response from addKeranjang API:", response.data);
      // Handle response sesuai dengan hasil yang diperoleh
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Handle error
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
        numberOfLines={4} // or more depending on your needs
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
    textAlignVertical: 'top', // Ensure top align for Android
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
    // Gaya untuk TextInput
    borderWidth: 1,
    borderColor: '#6200EE', // Warna border
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
    // Gaya untuk Tombol
    backgroundColor: '#6200EE', // Warna background untuk tombol
  padding: 15,
  borderRadius: 5,
  alignItems: 'center', // Menyelaraskan item-item secara vertikal di tengah
  justifyContent: 'center', // Menyelaraskan item-item secara horizontal di tengah
  marginTop: 20, // Tambahkan jarak di atas
  marginBottom: 20, // Tambahkan jarak di bawah
  },
  buttonText: {
    // Gaya untuk teks dalam Tombol
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Menyelaraskan teks
  },
  buttonIcon: {
    // Gaya untuk ikon dalam Tombol, jika ada
    color: 'white', // Warna ikon
  },
});

export default PrintOnlyLanjutanScreen;
