import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';

const EditAddress = ({ navigation, route }) => {
  const { id_alamat } = route.params;
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
    fetchAddress();
    fetchProvinsi();
  }, []);

  const fetchAddress = async () => {
    try {
      const formData = new FormData();
      formData.append('id_alamat', id_alamat);

      const response = await Axios.post('https://heyiamhasan.com/porto/iprintNew/Api/getAlamat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status) {
        const address = response.data.data;
        setNamaPenerima(address.nama_penerima);
        setNomorHP(address.nomor_hp);
        setNamaJalan(address.nama_jalan);
        setKelurahan(address.kelurahan);
        setKecamatan(address.id_kecamatan);
        setKota(address.id_kabupaten);
        setProvinsi(address.id_provinsi);
        setKodePos(address.kode_pos);
        setDetailAlamat(address.detail);
      } else {
        Alert.alert('Gagal', 'Gagal mendapatkan data alamat');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mendapatkan data alamat');
    }
  };

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

  const handleProvinsiChange = async (provinsiId) => {
    setProvinsi(provinsiId);
    setKabupatenList([]);
    setKecamatanList([]);
    setKelurahanList([]);

    try {
      const formData = new FormData();
      formData.append('id_provinsi', provinsiId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKabupatenByByProvinsi',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      const formData = new FormData();
      formData.append('id_kabupaten', kabupatenId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKecamatanByIdKabupaten',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      const formData = new FormData();
      formData.append('id_kecamatan', kecamatanId);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKelurahanByIdKecamatan',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      formData.append('id_alamat', id_alamat);
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
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/editAlamat',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(formData)

      if (response.data.status) {
        Toast.show("Alamat berhasil diupdate")
        setTimeout(() => {
            navigation.goBack()
        }, 1400);
        // Alert.alert('Success', 'Alamat berhasil diupdate', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Failed', response.data.message || 'Gagal mengupdate alamat');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data alamat');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Edit Alamat</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          placeholderTextColor={'#888585'}
          value={namaPenerima}
          onChangeText={setNamaPenerima}
        />
        <TextInput
          style={styles.input}
          placeholder="Nomor Telepon"
          placeholderTextColor={'#888585'}
          value={nomorHP}
          onChangeText={setNomorHP}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Jalan/Gedung, No.Rumah"
          placeholderTextColor={'#888585'}
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
          placeholderTextColor={'#888585'}
          value={kodePos}
          keyboardType="numeric"
          onChangeText={setKodePos}
        />
        <TextInput
          style={styles.input}
          placeholder="Detail Alamat (Patokan, dll)"
          placeholderTextColor={'#888585'}
          value={detailAlamat}
          onChangeText={setDetailAlamat}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: '#5D3FD3',
    marginRight: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    padding: 16,
  },
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

export default EditAddress;
