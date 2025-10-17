import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from './utils/Api';
import FormData from 'form-data';
import { formatRupiah } from './utils/currencyUtils';

const CheckoutLiveScreen = ({ navigation, route }) => {
  const { lebar, panjang, duplikasiMotif, deskripsi, image, tipe_kain, id_kain } = route.params;
  const [cartData, setCartData] = useState([
    {
      id_keranjang: 1, // Ensure this is set
      judul: 'Contoh Kain',
      harga_total: '100000',
      gambar: image,
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedShippingongkir, setSelectedShippingongkir] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminFee, setAdminFee] = useState('');

  useEffect(()=>{
    const getAdminFee = async () => { 
      try {
        const response = await Axios({
          method: 'get',
          url: `https://heyiamhasan.com/porto/iprintNew/Api/getAdminFee`,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("dddd");
        console.log(response.data);
        console.log("ooooooodooo");
        if (response.data && response.data.status) {
          // setCartData([newData]);
          const value = response.data.data[0].value;
          console.log("value+",value)
          setAdminFee(value);
        } else {
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    }
    getAdminFee();
  },[])


  useEffect(() => {
    const getCartDataById = async () => {
      const formData = new FormData();
      formData.append('tipe_kain', tipe_kain);
      formData.append('id_kain', id_kain);
      formData.append('panjang', panjang);
      try {
        const response = await Axios({
          method: 'post',
          data: formData,
          url: `https://heyiamhasan.com/porto/iprintNew/Api/getKainHarga`,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("wdwdwd");
        console.log(response.data);
        console.log("oooooooooooowdwdoooooo");
        if (response.data && response.data.status) {
          // Ensure id_keranjang is part of the data
          const newData = {
            ...response.data.data,
            id_keranjang: 1, // This should be dynamically set or obtained
          };
          setCartData([newData]);
        } else {
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    getCartDataById();
  }, [tipe_kain, id_kain, panjang]);

  const handlePayment = async () => {
    if (!cartData.length) {
      Alert.alert('Error', 'Cart data is empty.');
      return;
    }

    if (!selectedAddress) {
      Alert.alert('Error', 'Please select an address.');
      return;
    }

    setLoading(true);

    const item = cartData[0];

    try {
      const formData = new FormData();

      formData.append('tipe_kain', tipe_kain);
      formData.append('id_kain', id_kain);
      formData.append('panjang', panjang);
      formData.append('keterangan', note);
      formData.append('expedisi', selectedShipping);
      formData.append('ongkir', selectedShippingongkir); // Example value, update as needed
      formData.append('metode_pembayaran', 1); // Example value, update as needed
      formData.append('id_alamat', selectedAddress.id);
      formData.append('gambar', {
        uri: image,
        type: 'image/jpeg', // or 'image/png'
        name: image.split('/').pop(),
      });

      const response = await Axios.post('https://heyiamhasan.com/porto/iprintNew/api/CreateTransaksi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("=======xxxCreateTransaksixx==========");
      console.log(response.data);
      console.log("=======CreateTransaksixxxxx==========");

      if (response.data.status) {
        Alert.alert('Success', 'Transaction created successfully');
        setTimeout(() => {
          navigation.navigate('Beranda');
        }, 1500);
      } else {
        console.log("Failed response data:", response.data);
        Alert.alert('Failed', response.data.message || 'Transaction failed');
      }
    } catch (error) {
      console.error("Error during transaction creation:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      Alert.alert('Error', 'An error occurred while creating the transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShipping = () => {
    if (!selectedAddress) {
      Alert.alert('Mohon pilih alamat terlebih dahulu');
      return;
    }
    navigation.navigate('ShippingSelection', { setSelectedShipping, id_alamat: selectedAddress.id, setSelectedShippingongkir });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check Out</Text>
      <TouchableOpacity
        style={styles.selectContainer}
        onPress={() => navigation.navigate('AddressSelection', { setSelectedAddress, source: 'CheckoutScreen' })}
      >
        <Text style={styles.selectText}>{selectedAddress ? selectedAddress.nama : 'Pilih Alamat'}</Text>
      </TouchableOpacity>
      <FlatList
        data={cartData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri:image }} style={styles.itemImage} />
            <View style={styles.itemDetail}>
              <Text style={styles.itemTitle}>{item.nama_kain} - {panjang} M </Text>
              <Text style={styles.itemPrice}>{formatRupiah(item.harga_total)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id_keranjang.toString()}
      />
       <View style={styles.feeContainer}>
        <Text style={styles.feeText}>Biaya Admin: {formatRupiah(adminFee)}</Text>
      </View>

      <TouchableOpacity style={styles.selectContainer} onPress={handleSelectShipping}>
        <Text style={styles.selectText}>{selectedShipping ? selectedShipping + " -  " + formatRupiah(selectedShippingongkir) : 'Pilih Expedisi'}</Text>
      </TouchableOpacity>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Grand Total: {formatRupiah(cartData.reduce((total, item) => total + parseFloat(item.harga_total) + (selectedShippingongkir || 0) +parseFloat(adminFee), 0))}</Text>
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Processing Payment...</Text>
        </View>
      )}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  feeContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feeText: { fontSize: 18, color: '#333' },
});

export default CheckoutLiveScreen;
