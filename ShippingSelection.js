import React,{useEffect,useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,ActivityIndicator  } from 'react-native';
import Axios from 'axios';

const shippings = [
  'Regular (2-4 Hari) - JNE Rp 9.000',
  'Regular (2-4 Hari) - JNT Rp 9.000',
  'Same Day (Hari yang Sama) - Gojek Rp 19.000',
  'Same Day (Hari yang Sama) - Grab Rp 22.000',
  // ... add more shipping options
];


const ShippingSelection = ({ route, navigation }) => {
  const [originDetails, setOriginDetails] = useState(null);
  const [destinationDetails, setDestinationDetails] = useState(null);
  const { setSelectedShipping, id_alamat, setSelectedShippingongkir} = route.params;
  const [loading, setLoading] = useState(true);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    const getCartDataById = async () => {
      try {
        const formData = new FormData();
        formData.append('id_alamat', id_alamat);
        const response = await Axios.post('https://heyiamhasan.com/porto/iprintNew/Api/cekEkspedisi', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data && response.data.data.status.description=="OK") {
          
          setOriginDetails(response.data.data.origin_details);
          setDestinationDetails(response.data.data.destination_details);
          setCouriers(Object.values(response.data.courier));

        } else {
          console.log('No cart data received:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
      finally {
        setLoading(false);
      }
    };
    
    getCartDataById();
  }, []);
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={styles.locationText}>Tunggu Sesaat, Sedang Kalkulasi Ongkir</Text>
      </View>
    );
  }

  console.log('Selected Address ID:', id_alamat);

  const renderCourierItem = ({ item }) => (
    <TouchableOpacity
    style={styles.shippingContainer}
    onPress={() => {
        console.log(item.costs)
        console.log(item)
        setSelectedShipping(item.code);
        setSelectedShippingongkir(item.costs);
        navigation.goBack();
      }}
    >
      <Text style={styles.shippingText}>{`${item.name} - Rp ${item.costs.toLocaleString()}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Expedisi</Text>
      {originDetails && destinationDetails && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Origin: {`${originDetails.city_name}, ${originDetails.province}`}</Text>
          <Text style={styles.locationText}>Destination: {`${destinationDetails.city_name}, ${destinationDetails.province}`}</Text>
        </View>
      )}
      
      <FlatList
        data={couriers}
        renderItem={renderCourierItem}
        keyExtractor={(item) => item.code}
      />

      {/* <FlatList
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
      /> */}

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
  locationContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#333333',
  },
  shippingContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#5D3FD3',
    borderWidth: 1,
    elevation: 3,
  },
  shippingText: {
    fontSize: 16,
    color: '#333333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShippingSelection;