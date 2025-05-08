import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Add this line for MaterialCommunityIcons
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Ionicons'; // Replace with the correct icon library if needed
import DeviceInfo from 'react-native-device-info';
import BASE_URL from './config';

const SettingsScreen = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(0); // Assume a state that holds the notification count
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [profile, setProfile] = useState({
    id_user: '',
    nama_user: '',
    email: '',
    no_phone: '',
    status: '',
    foto_user: '',
  });
  const checkLoginAndFetchProfile = async () => {
    const userDataString = await AsyncStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      fetchProfile(userData.id);
    } else {
      // Not logged in
      navigation.navigate('Login');
    }
  };
  const fetchProfile = async (userId) => {
    try {
      const response = await Axios.get(BASE_URL.BASE_URL+'getFotoProfile');
      if (response.data && response.data.status) {
        setProfile(response.data.data);
      } else {

        if (response.data.message === "Harap Login Terlebih Dahulu!") {
          alert('Harap Login Terlebih Dahulu!');
          navigation.navigate('Login');
        } else {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginAndFetchProfile();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await Axios.get(BASE_URL.BASE_URL+'getFotoProfile');
        console.log(response)
        if (response.data && response.data.status) {
          setProfile(response.data.data);
        } else {
          console.log('Failed to fetch profile:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    getProfile();
  }, []);
  const handleLogout = () => {
    // Show confirmation dialog
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah kamu ingin keluar?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Ya", onPress: () => performLogout() }
      ],
      { cancelable: false }
    );
  };
  const performLogout = () => {
    // Clear the session data
    // This will depend on how you are managing the session.
    // For example, if using AsyncStorage then you'd do something like:
    AsyncStorage.clear(); // this will clear all AsyncStorage data
  
    // Show a message that logout is successful and then redirect after 2 seconds
    Alert.alert("Berhasil", "Kamu telah keluar.", [
      {
        text: "OK",
        onPress: () => {
          setTimeout(() => {
            navigation.navigate('Login'); // replace 'Login' with the name of your login screen
          }, 1500);
        }
      }
    ]);
  };
  const openWhatsApp = (number) => {
    let message = 'Halo, saya ingin bertanya mengenai iPrint.';
    let whatsappLink = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${number}`;
    let whatsappBrowserLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappLink)
      .then((supported) => {
        if (!supported) {
          Linking.openURL(whatsappBrowserLink); // Buka di browser jika WhatsApp tidak tersedia

        } else {
          return Linking.openURL(whatsappLink);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartIconContainer}>
            <MaterialCommunityIcons name="cart" size={30} color="#5D3FD3" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.profileSection} onPress={() => {navigation.navigate('EditProfile');}}>
         <Image
          style={styles.profilePic}
          source={{ uri: profile.foto_user }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.nama_user}</Text>
          <Text style={styles.profileEdit}>Edit Profil</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.menuSection}>
        <MenuItem title="Alamat Saya" iconName="location-outline" 
        

        onPress={() => navigation.navigate('AddressSelection', { setSelectedAddress, source: 'SettingScreen' })} // Make sure the route name matches
        
        />
        <MenuItem 
        title="Ubah Password" 
        iconName="lock-closed-outline" 
        onPress={() => navigation.navigate('ChangePassword')} // Make sure the route name matches
        
         />
        <MenuItem 
          title="Pengaturan Notifikasi"
          iconName="notifications-outline"           
          onPress={() => navigation.navigate('NotificationSettings')} // Make sure the route name matches

          />
        <MenuItem title="Bahasa / Language" iconName="language-outline" 
        onPress={()=>Toast.show("Fitur Akan Segera Hadir")}
        />

        <MenuItem 
          title="Kebijakan Privasi" 
          iconName="document-text-outline" 
          onPress={() => navigation.navigate('PrivacyPolicy')} // Make sure the route name matches
        />

        <MenuItem title="Tentang" iconName="information-circle-outline"
          onPress={() => navigation.navigate('Tentang')} // Make sure the route name matches
        />

        <MenuItem title="Suka iPrint? Berikan nilai dan ulasan!" iconName="star-outline" />
        <MenuItem title="Hubungi Kami" 
         onPress={() => openWhatsApp('6289602350857')}
         iconName="call-outline" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const MenuItem = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={iconName} size={24} style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
    <Icon name="chevron-forward-outline" size={24} style={styles.menuIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
  cartIconContainer: {
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
    zIndex: 1,
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: 'white', // or your preferred header background color
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#5D3FD3',
    flex: 1,
    textAlign: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  profileInfo: {
    justifyContent: 'center',
    color: '#000',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileEdit: {
    fontSize: 14,
    color: '#FF612E',
  },
  menuSection: {
    marginTop: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 24,
    height: 24,
    color: '#100821',
    marginRight: 20,

  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#100821',
  },
  logoutButton: {
    backgroundColor: '#D11A2A', // or any color that fits your design
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Adjust as needed
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  footerIcon: {
    color: '#5D3FD3',
  },
  // ...other styles if necessary
  });
  
  export default SettingsScreen;