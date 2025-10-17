import React, { useState } from 'react';
  
  import { Dimensions,View, Text, TouchableOpacity, StyleSheet, Image, Platform, PermissionsAndroid, Alert } from 'react-native';
  import { Linking } from 'react-native';
import ImagePicker from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you have installed react-native-vector-icons
const {width: viewportWidth} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const PrintCutScreen = ({ navigation,notificationCount }) => {
  const [image, setImage] = useState(null);  
  const handleChoosePhoto = async () => {
    const options = {
      title: 'Pilih Foto',
      takePhotoButtonTitle: 'Ambil Foto dengan Kamera', // Teks untuk tombol kamera
      chooseFromLibraryButtonTitle: 'Pilih dari Galeri', // Teks untuk tombol galeri
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo', // 'photo' atau 'video'
    };
    launchImageLibrary(options, callback)

    // ImagePicker.showImagePicker(options, (response) => {
    //   if (response.didCancel) {
    //     console.log('Pengguna membatalkan pemilihan foto');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //     Alert.alert('Error', 'Terjadi kesalahan: ' + response.error);
    //   } else {
    //     const source = { uri: response.uri };
    //     // Lakukan sesuatu dengan foto yang dipilih
    //     console.log(source);
    //   }
    // });
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const sdkVersion = Platform.Version;
  
      try {
        if (sdkVersion >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Izin Akses Gambar',
              message: 'Aplikasi memerlukan izin untuk mengakses gambar di galeri Anda.',
              buttonNeutral: 'Tanya Nanti',
              buttonNegative: 'Tolak',
              buttonPositive: 'Izinkan',
            }
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const read = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          const write = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          const camera = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          return (
            read === PermissionsAndroid.RESULTS.GRANTED &&
            write === PermissionsAndroid.RESULTS.GRANTED &&
            camera === PermissionsAndroid.RESULTS.GRANTED
          );
        }
      } catch (error) {
        console.warn('Permission error:', error);
        return false;
      }
    }
    return true;
  };
  


const handleUploadPress = async () => {
  console.log("Meminta izin penyimpanan"); // Debug log
  const hasPermission = await requestStoragePermission();
  console.log("Has permission: ", hasPermission); // Debug log
  if (!hasPermission) {
    Alert.alert("Izin diperlukan", "Aplikasi ini membutuhkan izin untuk mengakses galeri anda.");
    return;
  }

  console.log("Menampilkan Image Picker"); // Debug log
  const options = {
    title: 'Pilih Gambar',
    takePhotoButtonTitle: 'Ambil Foto dengan Kamera',
    chooseFromLibraryButtonTitle: 'Pilih dari Galeri',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    mediaType: 'photo',
  };

  // const result = await launchCamera(options);
  // console.log("Result: ", result); // Debug log

  // launchImageLibrary(options, callback)

  launchImageLibrary(options, (response) => {
    console.log("Response: ", response); // Debug log
      if (response.didCancel) {
        console.log('Pengguna membatalkan pemilihan gambar');
      } else if (response.error) {
        console.log('Error ImagePicker: ', response.error);
        Alert.alert("Error", "Terjadi kesalahan: " + response.error);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        console.log("Gambar terpilih: ", uri); // Debug log
        setImage({ uri: uri });
        navigation.navigate('PreviewCut', { image: uri }); // Kirimkan URI sebagai string
      } else {
        console.log('Tidak ada gambar yang dipilih');
      }
    });
};




  const [imageUri, setImageUri] = useState(null);
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'App Image Picker Permission',
            message: 'App needs access to your gallery...',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    ImagePicker.showImagePicker({
      title: 'Select Design',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImageUri(source.uri);
        // Proceed to the Preview screen with the image uri
        navigation.navigate('PreviewCut', { imageUri: source.uri });
      }
    });
  };
  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Icon name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
        <View style={styles.cartIconContainer}>
          <Icon name="cart" size={24} color="#5D3FD3" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>{notificationCount}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.headerTitle}>Print & Cut</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
        <Image
          source={require('./assets/images/uploaddesign.png')} // Replace with the actual path
          style={styles.uploadImage}
        />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backIcon: {
    // Styles for the back icon
  },
  cartIcon: {
    // Styles for the shopping cart icon
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200, // Adjust the margin as needed
  },
  uploadImage: {
    width: 150, // Set the width as needed
    height: 150, // Set the height as needed
    resizeMode: 'contain',
  },
  
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    marginTop: 20,
    marginBottom: 25,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  carouselImage: {
    width: viewportWidth, // Width of the viewport
    height: 200,
    borderRadius: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#fff', // A background color
    elevation: 2, // Shadow for Android
    padding: 15,
    borderRadius: 8,
  },
  carouselContainer: {
    marginVertical: 20,
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
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // ... other styles you may need
});

export default PrintCutScreen;
