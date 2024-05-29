import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

const TransactionDetail = ({ route, navigation }) => {
  const { id_transaksi } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactionDetails = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id_transaksi', id);

      const response = await Axios({
        method: 'post',
        url: 'https://heyiamhasan.com/porto/iprintNew/Api/getTransaksiById',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("============xxxxxxxxxxxx========");
      console.log(response.data);
      console.log("============xxxxxxxxxxxx========");
      if (response.data && response.data.status) {
        setTransaction(response.data.data);
      } else {
        console.log('No transaction data received:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionDetails(id_transaksi);
  }, [id_transaksi]);

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Toast.show('Kode resi has been copied to clipboard');
  };

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
        <Text style={styles.headerTitle}>{transaction && transaction.kode_transaksi}</Text>
      </View>
      {transaction ? (
        <View style={styles.transactionContainer}>
          <Image source={{ uri: transaction.gambar }} style={styles.transactionImage} />
          <Text style={styles.transactionTitle}>{transaction.judul}</Text>
          <Text style={styles.transactionInfo}>Kode Transaksi: {transaction.kode_transaksi}</Text>
          <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.nama_status) }]}>
            Status: {transaction.nama_status}
          </Text>
          <Text style={styles.transactionDate}>Tanggal: {transaction.created_at}</Text>
          <Text style={styles.transactionInfo}>Panjang: {transaction.panjang} Meter</Text>
          <Text style={styles.transactionInfo}>Keterangan: {transaction.keterangan} </Text>
          <Text style={styles.transactionInfo}>Expedisi: {transaction.expedisi}</Text>
          <Text style={styles.transactionInfo}>Harga Total per Meter: Rp {formatRupiah(transaction.total.toString())}</Text>
          <Text style={styles.transactionInfo}>Ongkir: Rp {formatRupiah(transaction.ongkir.toString())}</Text>
          <Text style={styles.transactionInfo}>Admin: Rp {formatRupiah(transaction.admin.toString())}</Text>
          {transaction.no_resi && (
            <TouchableOpacity style={styles.trackingContainer} onPress={() => copyToClipboard(transaction.no_resi)}>
              <Text style={styles.trackingNumber}>Kode Resi: </Text>
              <Text style={styles.trackingNumber}>{transaction.no_resi}</Text>
              <Text style={styles.trackingHint}>(Klik to copy)</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.totalText}>Total Keseluruhan: Rp {formatRupiah(transaction.total_pesanan.toString())}</Text>
        </View>
      ) : (
        <Text>No transaction data found.</Text>
      )}
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return '#FFA500';
    case 'Sudah Bayar':
      return '#008000';
    case 'Selesai':
      return '#0000FF';
    case 'Batal':
      return '#FF0000';
    default:
      return '#000';
  }
};

const formatRupiah = (number) => {
  // return number
  // Ensure the input is a string and remove any non-digit characters
  let numStr = number.toString().replace(/\D/g, '');
  
  // Handle empty string case
  if (numStr === '') return '0';

  // Reverse the string, match groups of 3 digits, and join with dots
  let reverse = numStr.split('').reverse().join('');
  let ribuan = reverse.match(/\d{1,3}/g);
  return ribuan.join('.').split('').reverse().join('');
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
    textAlign: 'center',
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  transactionContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginTop: 10,
  },
  transactionImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  transactionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  transactionInfo: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  transactionStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E0F7FA',
    borderRadius: 5,
  },
  trackingNumber: {
    fontSize: 16,
    color: '#000',
  },
  trackingHint: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 20,
  },
});

export default TransactionDetail;
