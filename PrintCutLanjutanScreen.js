import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { CommonActions } from '@react-navigation/native';
import BASE_URL from './config';

const PrintCutLanjutanScreen = ({ navigation, route }) => {
  const { image } = route.params; // Gambar dari halaman sebelumnya
  console.log(image);
  const [duplikasiMotif, setDuplikasiMotif] = useState(false);
  const [lebar, setLebar] = useState('1.5');
  const [panjang, setPanjang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedFabric, setSelectedFabric] = useState();
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleNext = () => {
    console.log("Lebar:", lebar);
    console.log("Panjang:", panjang);
    console.log("Duplikasi Motif:", duplikasiMotif);
  };

  const handlePesanSekarang = () => {    
    if(panjang==0||panjang==null){
      return alert("Mohon Isi Semua Yang Di Perlukan!")
    }

    navigation.navigate('CheckoutLive', { lebar, panjang, duplikasiMotif, deskripsi,image, tipe_kain:2,id_kain:selectedFabric });
    console.log("Pesan Sekarang dengan spesifikasix:", { lebar, panjang, duplikasiMotif, deskripsi });
  };

  useEffect(() => {
    Axios.get(BASE_URL.BASE_URL+'kain_printing')
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

  const handleTambahKeKeranjang = async () => {
    setIsAdding(true);
    const formData = new FormData();
    formData.append('tipe_kain', '2');
    formData.append('id_kain', selectedFabric);
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

      console.log("====cut Lanjutan========");
      console.log(response.data);
      console.log("==============");

      if (response.data.status) {
        console.log(response.data);
        alert('Berhasil menambahkan ke keranjang');
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'Home' },
                { name: 'Cart' },
              ],
            })
          );
        }, 2000);
      } else {
        alert(response.data.message);
      }

      console.log("Response from addKeranjang API:", response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
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

      <TouchableOpacity style={styles.button} onPress={handleTambahKeKeranjang} disabled={isAdding}>
        <Text style={styles.buttonText}>{isAdding ? 'Menambahkan...' : 'Tambahkan ke Keranjang'}</Text>
      </TouchableOpacity>

      {isAdding && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#6200EE',
    marginBottom: 20,
    overflow: 'hidden',
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

export default PrintCutLanjutanScreen;
