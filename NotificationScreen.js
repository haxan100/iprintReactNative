import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const NotificationScreen = ({ navigation }) => {
  // Dummy data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Selesaikan Pembayaran!',
      details: 'Selesaikan pembayaran No. Pesanan : 22009IJLM9G sebelum 23.59 2 February 2021',
    },
    {
      id: '2',
      title: 'Pembayaran Berhasil!',
      details: 'Pembayaran No. Pesanan : 22009IJLM9G telah berhasil kami konfirmasi, pesananmu segera diproses',
    },
    {
      id: '3',
      title: 'Pembayaran Berhasil!',
      details: 'Pembayaran No. Pesanan : 22009IJLM9G telah berhasil kami konfirmasi, pesananmu segera diproses',
    },
    // ... Add more notifications here
  ]);

  const handleDelete = (id) => {
    Alert.alert(
      'Hapus Notifikasi',
      'Apakah Anda yakin ingin menghapus notifikasi ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => {
            setNotifications(notifications.filter(notification => notification.id !== id));
          },
        },
      ]
    );
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteButtonText}>Hapus</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDetails}>{item.details}</Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={30} color="#5D3FD3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
          <Icon name="cart" size={24} color="#5D3FD3" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>9</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.notificationsList}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  backButton: {},
  cartButton: {
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
  notificationsList: {},
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  notificationDetails: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
