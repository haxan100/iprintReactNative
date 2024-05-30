import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const AddressSelection = ({ route, navigation }) => {
  const setSelectedAddress = route.params?.setSelectedAddress;
  const sourceScreen = route.params?.source;  // Ensure we know which screen accessed this component
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(sourceScreen)
  const fetchAddresses = async () => {
    try {
      const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/listAlamat');
      if (response.data && response.data.status) {
        console.log(response.data.data)
        setAddresses(response.data.data);
      } else {
        console.log('No address data received:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchAddresses();
    }, [])
  );

  const handleDeleteAddress = async (id_alamat) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah kamu akan menghapus alamat?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Iya',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('id_alamat', id_alamat);

              const response = await Axios({
                method: 'post',
                url: 'https://heyiamhasan.com/porto/iprintNew/Api/hapusAlamat',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
              });

              if (response.data.status) {
                setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id_alamat !== id_alamat));
              } else {
                Alert.alert('Failed', 'Gagal menghapus alamat');
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'An error occurred while deleting the address');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderRightActions = (id_alamat) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteAddress(id_alamat)}
    >
      <Text style={styles.deleteButtonText}>Hapus</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id_alamat)}>
      <View style={styles.addressWrapper}>
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={() => {
            if (sourceScreen !== 'SettingScreen') {  // Check if the source is not SettingScreen
              setSelectedAddress({ id: item.id_alamat, nama: `${item.nama_penerima} | +${item.nomor_hp} | ${item.detail}` });
              navigation.goBack();
            }
          }}
          disabled={sourceScreen === 'SettingScreen'}  // Disable button if source is SettingScreen
        >
          <Text style={styles.addressText}>{`${item.nama_penerima} | +${item.nomor_hp}\n${item.detail}, ${item.kecamatan}, ${item.kabupaten}, ${item.provinsi}, ${item.kode_pos}`}</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Pilih Alamat</Text>
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Alamat kosong, Mohon Tambahkan alamat</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_alamat.toString()}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAddress', { fetchAddresses })}>
        <Text style={styles.addButtonText}>Tambah Alamat</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: 'black' },
  addressWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addressContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addressText: { fontSize: 16, color: '#333' },
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
  addButton: {
    padding: 16,
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#333', textAlign: 'center' },
});

export default AddressSelection;
