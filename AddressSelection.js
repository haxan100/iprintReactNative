import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Axios from 'axios';

const AddressSelection = ({ route, navigation }) => {
  const { setSelectedAddress } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/listAlamat');
        if (response.data && response.data.status) {
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

    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Alamat</Text>
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Alamat kosong, Mohon Tambahkan alamat</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={() => {
                setSelectedAddress(item.id_alamat);
                navigation.goBack();
              }}
            >
              <Text style={styles.addressText}>{`${item.nama_penerima} | +${item.nomor_hp}\n${item.detail}, ${item.kecamatan}, ${item.kabupaten}, ${item.provinsi}, ${item.kode_pos}`}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id_alamat.toString()}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAddress')}>
        <Text style={styles.addButtonText}>Tambah Alamat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: 'black' },
  addressContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addressText: { fontSize: 16, color: '#333' },
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