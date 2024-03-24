import React, { useState,useEffect  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image ,Alert } from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import { formatRupiah } from './utils/currencyUtils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from './utils/Api'; // Pastikan path ini sesuai dengan struktur direktori Anda

// Data dummy, gantikan dengan state yang menyimpan data keranjang belanja Anda
const cartItems = [
  {
    id: '1',
    title: 'Cut n Print',
    description: 'Bahan Satin Velvet, 500-1001 M (1.5 x 150M)',
    price: 'Rp 59.000',
    quantity: 0,
    image: 'https://heyiamhasan.com/porto/iprintNew/Images/gambar/65feb6f62ff9f_gambar.jpg', // Link ke gambar

  },
  // ... tambahkan item lainnya
];


const CartScreen = ({navigation,onDelete }) => {
  const [cartData, setCartData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [cart, setCart] = useState(cartItems);

  useEffect(() => {
    const getCartData = async () => {
      try {
        // Panggil API untuk mendapatkan data keranjang
        // const response = await Axios.get('http://heyiamhasan.com/porto/iprintNew/Api/getKeranjang');
        const response = await Api.get('http://heyiamhasan.com/porto/iprintNew/Api/getKeranjang');

        if (response.data && response.data.status) {
          // Jika ada data dan status true, set data ke state
          setCartData(response.data.data);
        } else {
          // Handle jika status false atau tidak ada data
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        // Handle error saat memanggil API
        console.error('Error fetching cart data:', error);
      }
    };

    getCartData();
    
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log("=============")
      console.log(userData)
      console.log("-----------")
      if (userData !== null) {
        // Jika ada data user di AsyncStorage, pengguna sudah login
        setIsLoggedIn(true);
      } else {
        // Jika tidak ada data user, pengguna belum login
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching login status', error);
    }
  };


  const handleQuantityChange = (id, diff) => {
    // Fungsi untuk menangani perubahan kuantitas produk
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + diff) } : item
      )
    );
  };
  const handlePesanSekarang = (item) => {
    console.log("Pesan Sekarang pressed for item: ", item);
    // Implement your action here, such as navigating to a confirmation screen
    // or directly handling the order logic
  };
  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Keranjang kosong</Text>
      </View>
    );
  };
  const renderItem = ({ item  }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.gambar }} style={styles.itemImage} />
      <View style={styles.itemDetail}>
        <Text style={styles.itemTitle}>{item.judul}</Text>
        <Text style={styles.ietmKecil}>{`Bahan ${item.nama_tipe_kain}, ${item.panjang}M`}</Text>
        <Text style={styles.itemPrice}>{formatRupiah(item.harga_total.toString())}</Text>
        {/* <Text style={styles.price}>{formatRupiah(item.harga_total)}</Text> */}

        <View style={styles.quantityContainer}>
          <TouchableOpacity 
          style={styles.orderButton} 
          onPress={() => handlePesanSekarang(item)}
        >
          <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress({item})}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#D11A2A" />
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const handleDeletePress = ({ item,  }) => {
    console.log(item)
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah kamu yakin akan menghapus keranjang ini?",
      [
        {
          text: "Tidak",
          style: "cancel"
        },
        {
          text: "Ya",
          onPress: () => handleDeleteCartItem (item.id_keranjang),
          style: "destructive" // Only for iOS, has no effect on Android
        }
      ]
    );
  }
  const handleDeleteCartItem = async (idKeranjang) => {
    try {
      const formData = new FormData();
      // Append the id_keranjang to the form data
      formData.append('id_keranjang', idKeranjang);
  
      // Call the API to delete the cart item using Axios
      const response = await Axios({
        method: 'post',
        url: 'http://heyiamhasan.com/porto/iprintNew/Api/deleteKeranjang',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // const response = await Axios.post('http://heyiamhasan.com/porto/iprintNew/Api/deleteKeranjang', formData);
  
  
      if (response.data.status) {
        Alert.alert("Sukses", "Keranjang berhasil dihapus.");
        // Update the cart data after the item is deleted
        setCartData(prevCartData => prevCartData.filter(item => item.id_keranjang !== idKeranjang));
      } else {
        Alert.alert("Gagal", "Tidak dapat menghapus keranjang.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan saat menghapus keranjang.");
    }
  };

  return (
    <View style={styles.screenContainer}>
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

      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout (0)</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  padding: 10, // Make it easier to press
},
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff', // or any color that fits your design
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // match your theme
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3FD3', // or your chosen color
  },
  checkoutContainer: {
    padding: 16,
    backgroundColor: '#fff', // match your theme
    borderTopWidth: 1,
    borderColor: '#e2e2e2', // or color that fits your design
  },
  checkoutButton: {
    backgroundColor: '#5D3FD3', // or any color that fits your design
    borderRadius: 5,
    padding: 16,
  },
  checkoutButtonText: {
    textAlign: 'center',
    color: '#fff', // or any color that fits your design
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  itemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4, // for android shadow
  },
  itemImage: {
    width: 100,
    height: 100,
    margin: 10
  },
  itemDetail: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10
  },
  ietmKecil: {
    fontSize: 18,
    color: '#888585'
  },
  itemTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold'
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF612E'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: '#ddd',
    borderRadius: 5
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  checkoutButton: {
    backgroundColor: '#5D3FD3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
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
