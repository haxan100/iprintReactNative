import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from './utils/Api';
import FormData from 'form-data';

const CheckoutScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const { id_keranjang } = item;  // Extract id_keranjang

  const [cartData, setCartData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const getCartDataById = async () => {
      try {
        const response = await Axios({
          method: 'get',
          url: `https://heyiamhasan.com/porto/iprintNew/Api/getKeranjangById/${id_keranjang}`,
          headers: { 'Content-Type': 'application/json' },
        });
        console.log("Response from getKeranjangById: ", response.data);
        if (response.data && response.data.status) {
          setCartData(response.data.data ? [response.data.data] : []); // Ensure cartData is an array
        } else {
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    getCartDataById();
  }, [id_keranjang]);

  const handlePayment = async () => {
    if (!cartData.length) {
      Alert.alert('Error', 'Cart data is empty.');
      return;
    }

    const item = cartData[0];

    try {
      const formData = new FormData();
      formData.append('id_keranjang', id_keranjang);
      // formData.append('expedisi', selectedShipping || 'jne');
      formData.append('expedisi', 'jne');
      formData.append('ongkir', '1000'); // Example value, update as needed
      formData.append('metode_pembayaran', '1'); // Example value, update as needed
      formData.append('id_alamat', selectedAddress || 1);
      formData.append('harga_admin', '5000'); // Example value, update as needed
      console.log(formData)
      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/api/CreateTransaksiFromCart',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("=======xxxCreateTransaksixx==========")
      console.log(response)
      console.log("=======CreateTransaksixxxxx==========")
      if (response.data.status) {
        Alert.alert('Success', 'Transaction created successfully');
      } else {
        console.log("Failed response data:", response.data);
        Alert.alert('Failed', response.data.message || 'Transaction failed');
      }
    } catch (error) {
      console.error("Error during transaction creation:", error);
      Alert.alert('Error', 'An error occurred while creating the transaction');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check Out</Text>
      <TouchableOpacity style={styles.selectContainer} onPress={() => navigation.navigate('AddressSelection', { setSelectedAddress })}>
        <Text style={styles.selectText}>{selectedAddress ? selectedAddress : 'Pilih Alamat'}</Text>
      </TouchableOpacity>
      <FlatList
        data={cartData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.gambar }} style={styles.itemImage} />
            <View style={styles.itemDetail}>
              <Text style={styles.itemTitle}>{item.judul}</Text>
              <Text style={styles.itemPrice}>Rp {item.harga_total}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id_keranjang.toString()}
      />
      <TouchableOpacity style={styles.selectContainer} onPress={() => navigation.navigate('ShippingSelection', { setSelectedShipping })}>
        <Text style={styles.selectText}>{selectedShipping ? selectedShipping : 'Pilih Expedisi'}</Text>
      </TouchableOpacity>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Grand Total: Rp {cartData.reduce((total, item) => total + parseFloat(item.harga_total), 0)}</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: 'black', textAlign: 'center' },
  selectContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectText: { fontSize: 16, color: '#333' },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: { width: 80, height: 80 },
  itemDetail: { flex: 1, justifyContent: 'center', padding: 16 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemPrice: { fontSize: 14, color: '#888' },
  totalContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  noteInput: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentButton: {
    padding: 16,
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CheckoutScreen;
