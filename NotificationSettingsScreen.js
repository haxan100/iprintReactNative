import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure this package is installed
import FormData from 'form-data';
import Axios from 'axios';

const NotificationSettingsScreen = ({ navigation }) => {
  const [whatsAppNotifications, setWhatsAppNotifications] = useState(true);
//   const toggleSwitch = () => {
//     setWhatsAppNotifications(previousState => !previousState);
//   };
  const changeWhatsAppNotification = async (status) => {
    try {
      const formData = new FormData();
      formData.append('notif_wa', status ? 'on' : 'off');

      const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/changeNotifWA', formData);
      console.log(response.data.data);

      if (response.data.status && response.data.data) {
        // Jika status true dan ada data, update toggle switch sesuai dengan data notif_wa
        setWhatsAppNotifications(response.data.data.notif_wa === 'on');
      } else {
        // Jika terjadi kesalahan, bisa tampilkan alert atau lakukan error handling
        console.log('Failed to update notification status:', response.data.message);
      }
    } catch (error) {
      console.error('Error changing notification status:', error);
    }
  };
  const toggleSwitch = () => {
    const newStatus = !whatsAppNotifications;
    setWhatsAppNotifications(newStatus);
    changeWhatsAppNotification(newStatus);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Icon name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View >
            <Text style={styles.headerTitle}>Notifikasi Aplikasi</Text>
        </View>
      </View>

      <View style={styles.notificationSection}>
        <Text style={styles.notificationTitle}>WhatsApp</Text>
        <Text style={styles.notificationDescription}>
          Informasi pemesanan dan pengiriman barang akan dikirimkan melalui WhatsApp
        </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={whatsAppNotifications ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={whatsAppNotifications}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
  },
  iconContainer: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign:'center'

  },
  notificationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  switch: {
    alignSelf: 'flex-start',
  },
  // Add any additional styles you need here
});

export default NotificationSettingsScreen;
