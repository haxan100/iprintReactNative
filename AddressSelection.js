import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const addresses = [
  'Loui Michael | +6222888907\nJl Miadra Barat II No.77, Muara, Jengger. Batavia Java, 18979',
  'Another Address | +1234567890\nJl Example No.123, Example City, 12345',
  // ... add more addresses
];

const AddressSelection = ({ route, navigation }) => {
  const { setSelectedAddress } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Alamat</Text>
      <FlatList
        data={addresses}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => {
              setSelectedAddress(item);
              navigation.goBack();
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.goBack()}>
        <Text style={styles.confirmButtonText}>Konfirmasi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  addressContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 },
  confirmButton: { padding: 16, backgroundColor: '#5D3FD3', borderRadius: 8, marginTop: 16 },
  confirmButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default AddressSelection;
