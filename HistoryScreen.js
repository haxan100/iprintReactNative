import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';

const HistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const formData = new FormData();
        formData.append('status', 'null'); // Update the status value according to your requirements

        const response = await Axios({
          method: 'post',
          url: 'https://heyiamhasan.com/porto/iprintNew/Api/ListRiwayatTransaksi',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data && response.data.status) {
          setOrders(response.data.data);
        } else {
          console.log('No orders data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching orders data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: 'https://yourdomain.com/path/to/image1.jpg' }} style={styles.itemImage} />
      <View style={styles.itemDetail}>
        <Text style={styles.itemTitle}>{item.judul}</Text>
        <Text style={styles.itemInfo}>Kode Transaksi: {item.kode_transaksi}</Text>
        <Text style={styles.itemPrice}>Rp {item.total_pesanan}</Text>
        <TouchableOpacity style={styles.orderButton} onPress={() => {/* Handle order again */}}>
          <Text style={styles.orderButtonText}>Pesan Lagi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
      </View>
    );
  }

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
            <Text style={styles.notificationCount}></Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id_transaksi.toString()}
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
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemDetail: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemInfo: {
    fontSize: 16,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
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
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HistoryScreen;
