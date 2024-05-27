import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const shippings = [
  'Regular (2-4 Hari) - JNE Rp 9.000',
  'Regular (2-4 Hari) - JNT Rp 9.000',
  'Same Day (Hari yang Sama) - Gojek Rp 19.000',
  'Same Day (Hari yang Sama) - Grab Rp 22.000',
  // ... add more shipping options
];

const ShippingSelection = ({ route, navigation }) => {
  const { setSelectedShipping } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Expedisi</Text>
      <FlatList
        data={shippings}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.shippingContainer}
            onPress={() => {
              setSelectedShipping(item);
              navigation.goBack();
            }}
          >
            <Text style={styles.shippingText}>{item}</Text>
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
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  shippingContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  shippingText: { fontSize: 16, color: '#333' },
  confirmButton: {
    padding: 16,
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});

export default ShippingSelection;
