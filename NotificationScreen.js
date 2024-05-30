import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Axios from 'axios';
import { Toast } from 'react-native-alert-notification';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/notifikasi');
      if (response.data && response.data.status) {
        setNotifications(response.data.data);
      } else {
        if (response.data.message === "Harap Login Terlebih Dahulu!") {
          // alert('Harap Login Terlebih Dahulu!');
          Toast('Harap Login Terlebih Dahulu')
          navigation.navigate('Login');
        }

        Alert.alert('Error', response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
          onPress: async () => {
            try {
              const response = await Axios.delete(`https://heyiamhasan.com/porto/iprintNew/Api/hapusNotifikasi/${id}`);
              if (response.data && response.data.status) {
                setNotifications(notifications.filter(notification => notification.id_notif !== id));
              } else {
                Alert.alert('Error', response.data.message || 'Failed to delete notification');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
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
    <Swipeable renderRightActions={() => renderRightActions(item.id_notif)}>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>{item.judul}</Text>
        <Text style={styles.notificationDetails}>{item.detail}</Text>
        <Text style={styles.notificationDate}>{item.created_at}</Text>
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
            <Text style={styles.notificationCount}></Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {loading ? (
        <ActivityIndicator size="large" color="#5D3FD3" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id_notif}
          style={styles.notificationsList}
        />
      )}
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
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
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
