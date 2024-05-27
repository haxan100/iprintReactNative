import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from './utils/Api';
import FormData from 'form-data';

const CheckoutScreen = ({ navigation, route }) => {
  const isi = route.params;
  console.log(isi);
  const [cartData, setCartData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const getCartData = async () => {
      try {
        const response = await Axios({
          method: 'get',
          url: 'https://heyiamhasan.com/porto/iprintNew/Api/getKeranjang', // Ganti dengan URL yang sesuai
          headers: { 'Content-Type': 'multipart/form-data' },
        });


        if (response.data && response.data.status) {
          setCartData(response.data.data);
        } else {
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    getCartData();
  }, []);

  const handlePayment = async () => {
    try {
      const formData = new FormData();
      formData.append('tipe_kain', '1');
      formData.append('id_kain', '11');
      formData.append('panjang', '250');
      formData.append('gambar', 'Firefly 20240510073927.png');
      formData.append('keterangan', note);
      formData.append('expedisi', selectedShipping);
      formData.append('ongkir', '9000');
      formData.append('metode_pembayaran', '1');
      formData.append('id_alamat', selectedAddress);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/api/CreateTransaksi',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status) {
        Alert.alert('Success', 'Transaction created successfully');
      } else {
        Alert.alert('Failed', 'Transaction failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating the transaction');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check Out</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AddressSelection', { setSelectedAddress })}>
        <View style={styles.addressContainer}>
          <Text>{selectedAddress ? selectedAddress : 'Pilih Alamat'}</Text>
        </View>
      </TouchableOpacity>
      <FlatList
        data={cartData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.gambar }} style={styles.itemImage} />
            <View style={styles.itemDetail}>
              <Text style={styles.itemTitle}>{item.judul}</Text>
              <Text style={styles.itemPrice}>{item.harga_total}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id_keranjang.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ShippingSelection', { setSelectedShipping })}>
        <View style={styles.shippingContainer}>
          <Text>{selectedShipping ? selectedShipping : 'Pilih Expedisi'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Grand Total: Rp 84.000</Text>
      </View>
      <TextInput
        style={styles.noteInput}
        placeholder="Tulis keterangan disini..."
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Pembayaran</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16,color:'black',alignItems:'center',alignSelf:'center' },
  addressContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 },
  itemContainer: { flexDirection: 'row', marginBottom: 16 },
  itemImage: { width: 80, height: 80, marginRight: 16 },
  itemDetail: { flex: 1, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#888' },
  shippingContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 },
  totalContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  noteInput: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 },
  paymentButton: { padding: 16, backgroundColor: '#5D3FD3', borderRadius: 8 },
  paymentButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default CheckoutScreen;
