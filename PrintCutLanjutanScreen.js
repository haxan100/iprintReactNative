// import { Axios } from 'axios';
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity,ActivityIndicator  } from 'react-native';
import Axios from 'axios';
import {Picker} from '@react-native-picker/picker';

const PrintCutLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // Gambar dari halaman sebelumnya
  console.log(image)
  const [duplikasiMotif, setDuplikasiMotif] = useState(false);
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedFabric, setSelectedFabric] = useState();
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    // Handle the next button press
    console.log("Lebar:", lebar);
    console.log("Panjang:", panjang);
    console.log("Duplikasi Motif:", duplikasiMotif);
    // Here you can do something with the values, like navigating to another screen or making an API call
  };
  const handlePesanSekarang = () => {
    // Handle pesan sekarang action
    console.log("Pesan Sekarang dengan spesifikasi:", { lebar, panjang, duplikasiMotif, deskripsi });
    // Implementasi fungsi pesan sekarang
  };

  useEffect(() => {
    Axios.get('https://heyiamhasan.com/porto/iprintNew/api/kain_printing')
      .then(response => {
        setFabrics(response.data.data);
        setSelectedFabric(response.data.data[0].id_kain_and_printing); // Set default selected fabric
      })
      .catch(error => {
        console.error("Error fetching fabrics:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    console.log("LOADINGGGGG")
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const handleTambahKeKeranjang = async () => {
    const formData = new FormData();
    formData.append('tipe_kain', '2');
    formData.append('id_kain', selectedFabric);
    formData.append('panjang', panjang);
    formData.append('catatan', deskripsi);
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
      console.log("====cut Lnajutan========")
      console.log(response.data)
      console.log("==============")
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
      <Text style={styles.headerTop}>Print Cut!</Text>
      <Text style={styles.header}>Cetak Kain Favorit-mu Sekarang!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <View style={styles.pickerContainer}>

          <Picker
            selectedValue={selectedFabric}
            onValueChange={(itemValue) => setSelectedFabric(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Pilih Kain" value={0} />
            {fabrics.map((fabric) => (
              <Picker.Item key={fabric.id_kain_and_printing} label={fabric.Nama_kain} value={fabric.id_kain_and_printing} />
            ))}
          </Picker>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={lebar}
        onChangeText={setLebar}
        placeholder="Lebar (m)"
        keyboardType="numeric"
        editable={false}
        selectTextOnFocus={false}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#6200EE',
    marginBottom: 20,
    overflow: 'hidden', // Add this to make the borderRadius work on Android
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000000',
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

export default PrintCutLanjutanScreen;
