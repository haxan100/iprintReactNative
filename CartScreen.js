import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { formatRupiah } from './utils/currencyUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from './utils/Api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import BASE_URL from './config';

const CartScreen = ({ navigation }) => {
  const [cartData, setCartData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getCartData = async () => {
      try {
        const response = await Api.get(BASE_URL.BASE_URL+'getKeranjang');
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
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching login status', error);
    }
  };

  const handlePesanSekarang = (item) => {
    navigation.navigate('Checkout', { item });
  };

  const handleDeletePress = (item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah kamu yakin akan menghapus keranjang ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel'
        },
        {
          text: 'Ya',
          onPress: () => handleDeleteCartItem(item.id_keranjang),
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteCartItem = async (idKeranjang) => {
    try {
      const formData = new FormData();
      formData.append('id_keranjang', idKeranjang);

      const response = await Axios({
        method: 'post',
        url: BASE_URL.BASE_URL+'deleteKeranjang',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status) {
        Alert.alert('Sukses', 'Keranjang berhasil dihapus.');
        setCartData(prevCartData => prevCartData.filter(item => item.id_keranjang !== idKeranjang));
      } else {
        Alert.alert('Gagal', 'Tidak dapat menghapus keranjang.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus keranjang.');
    }
  };

  const renderRightActions = (id_keranjang) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeletePress({ id_keranjang })}
    >
      <Text style={styles.deleteButtonText}>
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
      </Text>
      <Text style={styles.deleteButtonText}>
        Hapus
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id_keranjang)}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.gambar }} style={styles.itemImage} />
        <View style={styles.itemDetail}>
          <Text style={styles.itemTitle}>{item.judul}</Text>
          <Text style={styles.ietmKecil}>{`Bahan ${item.nama_tipe_kain}, ${item.panjang}M`}</Text>
          <Text style={styles.itemPrice}>{formatRupiah(item.harga_total.toString())}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => handlePesanSekarang(item)}
            >
              <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyCartText}>Keranjang kosong</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="chevron-left" size={30} color="#5D3FD3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <Icon name="chevron-left" size={30} color="transparent" />
      </View>

      {cartData.length > 0 ? (
        <FlatList
          data={cartData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_keranjang.toString()}
        />
      ) : (
        renderEmptyCart()
      )}
    </GestureHandlerRootView>
  );
};

// Styles
const styles = StyleSheet.create({
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  itemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
  },
  itemImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
  itemDetail: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
  },
  ietmKecil: {
    fontSize: 18,
    color: '#888585',
  },
  itemTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF612E',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: '#5D3FD3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartScreen;
