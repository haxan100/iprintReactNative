import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const AddAddress = ({ navigation }) => {
  const [namaPenerima, setNamaPenerima] = useState('');
  const [nomorHP, setNomorHP] = useState('');
  const [namaJalan, setNamaJalan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/getProvinsi');
        if (response.data && response.data.status) {
          setProvinsiList(response.data.data);
        } else {
          console.log('No provinsi data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching provinsi data:', error);
      }
    };
    fetchProvinsi();
  }, []);

  const handleProvinsiChange = async (provinsiId) => {
    setProvinsi(provinsiId);
    setKabupatenList([]);
    setKecamatanList([]);
    setKelurahanList([]);

    try {
      console.log("Fetching Kabupaten for Provinsi ID:", provinsiId);
      
      const formData = new FormData();
      formData.append('id_provinsi', provinsiId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKabupatenByByProvinsi',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Kabupaten Response:", response.data);

      if (response.data && response.data.status) {
        setKabupatenList(response.data.data);
      } else {
        console.log('No kabupaten data received:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching kabupaten data:', error);
    }
  };

  const handleKabupatenChange = async (kabupatenId) => {
    setKota(kabupatenId);
    setKecamatanList([]);
    setKelurahanList([]);

    try {
      console.log("Fetching Kecamatan for Kabupaten ID:", kabupatenId);
      
      const formData = new FormData();
      formData.append('id_kabupaten', kabupatenId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKecamatanByIdKabupaten',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Kecamatan Response:", response.data);

      if (response.data && response.data.status) {
        setKecamatanList(response.data.data);
      } else {
        console.log('No kecamatan data received:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
    }
  };

  const handleKecamatanChange = async (kecamatanId) => {
    setKecamatan(kecamatanId);
    setKelurahanList([]);

    try {
      console.log("Fetching Kelurahan for Kecamatan ID:", kecamatanId);

      const formData = new FormData();
      formData.append('id_kecamatan', kecamatanId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKelurahanByIdKecamatan',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Kelurahan Response:", response.data);

      if (response.data && response.data.status) {
        setKelurahanList(response.data.data);
      } else {
        console.log('No kelurahan data received:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching kelurahan data:', error);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const formData = new FormData();
      formData.append('id_provinsi', provinsi);
      formData.append('id_kabupaten', kota);
      formData.append('id_kecamatan', kecamatan);
      formData.append('kode_pos', kodePos);
      formData.append('detail', detailAlamat);
      formData.append('nomor_HP', nomorHP);
      formData.append('nama_penerima', namaPenerima);
      formData.append('nama_jalan', namaJalan);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/simpanAlamat',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status) {
        Alert.alert('Success', 'Address saved successfully', [{ text: 'OK', onPress: () => navigation.navigate('AddressSelection') }]);
      } else {
        Alert.alert('Failed', 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'An error occurred while saving the address');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tambah Alamat</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={namaPenerima}
        onChangeText={setNamaPenerima}
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor Telepon"
        value={nomorHP}
        onChangeText={setNomorHP}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Jalan/Gedung, No.Rumah"
        value={namaJalan}
        onChangeText={setNamaJalan}
      />
      <Picker
        selectedValue={provinsi}
        onValueChange={(itemValue) => handleProvinsiChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Provinsi" value="" />
        {provinsiList.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={kota}
        onValueChange={(itemValue) => handleKabupatenChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Kabupaten/Kota" value="" />
        {kabupatenList.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={kecamatan}
        onValueChange={(itemValue) => handleKecamatanChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Kecamatan" value="" />
        {kecamatanList.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={kelurahan}
        onValueChange={(itemValue) => setKelurahan(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Kelurahan" value="" />
        {kelurahanList.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Kode Pos"
        value={kodePos}
        onChangeText={setKodePos}
      />
      <TextInput
        style={styles.input}
        placeholder="Detail Alamat (Patokan, dll)"
        value={detailAlamat}
        onChangeText={setDetailAlamat}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    padding: 16,
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddAddress;
