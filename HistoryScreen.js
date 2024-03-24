import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Pastikan sudah menginstal package ini

const HistoryScreen = ({ navigation }) => { // Tambahkan navigation sebagai props
  const [orders, setOrders] = useState([]); // Gunakan state orders

  useEffect(() => {
    // Asumsikan Anda memanggil API di sini untuk mendapatkan riwayat pesanan
    // Sementara ini, saya akan menggunakan data dummy
    const fetchedOrders = [
      // Contoh data dummy
      { id: '1', title: 'Print Only', quantity: '2', price: '47000', image: 'https://yourdomain.com/path/to/image1.jpg' },
      // Tambahkan data lainnya di sini
    ];
    setOrders(fetchedOrders);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetail}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemInfo}>Bahan - 1.5 x 150 M (x {item.quantity})</Text>
        <Text style={styles.itemPrice}>Rp {item.price}</Text>
        <TouchableOpacity style={styles.orderButton} onPress={() => {/* Handle order again */}}>
          <Text style={styles.orderButtonText}>Pesan Lagi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart" size={24} color="#5D3FD3" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>5</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white', // atau warna yang sesuai dengan desain Anda
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // atau warna yang sesuai dengan desain Anda
  },
  cartIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  itemDetail: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  itemInfo: {
    fontSize: 16,
    color: '#555'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500'
  },
  orderButton: {
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default HistoryScreen;
