import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Axios from 'axios'; // Make sure Axios is installed and imported
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import FormData from 'form-data';

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    nama_user: '',
    email: '',
    no_phone: '',
    foto_user: '',
  });
  useEffect(() => {
    // Fetch the profile data from the API when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  
    const handleChoosePhoto = () => {
      const options = {
        noData: true,
        mediaType: 'photo',
        quality: 0.5 // You can specify the image quality from 0.0 - 1.0
      };

      launchImageLibrary(options, (response) => {
        console.log("Response: ", response); // Debug log
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Error ImagePicker: ', response.error);
          Alert.alert("Error", "Terjadi kesalahan: " + response.error);
        } else {
          if (response.assets && response.assets.length > 0) {
            // Assuming the first asset is the image
            const source = { uri: response.assets[0].uri };
            console.log("Gambar terpilih: ", source); // Debug log
            setProfile(prevState => ({ ...prevState, foto_user: source.uri }));
            handleProfilePicUpdate(source.uri);
          }
        }
      });
    };
    const handleProfileUpdate = async () => {
      try {
        const formData = new FormData();
        formData.append('nama_user', profile.nama_user);
        formData.append('email', profile.email);
        formData.append('no_phone', profile.no_phone);
    
        console.log('FormData:', formData);
    
        const response = await Axios.post('http://heyiamhasan.com/porto/iprintNew/Api/updateProfile', formData, {
          headers: {
            // Add any headers required by your API
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('Response:', response);
    
        if (response.data.status) {
          Alert.alert('Success', 'Profile updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    const handleProfilePicUpdate = async (imageUri) => {
      console.log("Image URI: ", imageUri);
      try {
          const formData = new FormData();
          formData.append('foto_user', {
              uri: imageUri,
              type: 'image/jpeg',
              name: 'profile-pic.jpg',
          });
  
          console.log("FormData prepared for upload: ", formData);
  
          const response = await Axios.post(
              'https://heyiamhasan.com/porto/iprintNew/Api/updateFotoProfile',
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } } // This line is often unnecessary, but included here just in case your server needs it.
          );
  
          console.log("Server Response: ", response.data);
  
          if (response.data.status) {
              Alert.alert('Success', 'Profile picture updated successfully');
          } else {
              Alert.alert('Error', 'Failed to update profile picture');
          }
      } catch (error) {
          console.error("Error during profile picture update: ", error);
          if (error.response) {
              // The server responded with a status code outside the range of 2xx
              console.log("Server Response Error: ", error.response.data);
          } else if (error.request) {
              // The request was made but no response was received
              console.log("No response received: ", error.request);
          } else {
              // Something happened in setting up the request that triggered an error
              console.log("Error setting up the request: ", error.message);
          }
      }
  };
  

  const fetchProfileData = async () => {
    try {
      const response = await Axios.get('http://heyiamhasan.com/porto/iprintNew/Api/getFotoProfile');
      if (response.data.status) {
        console.log(response.data.data)
        setProfile(response.data.data);
      } else {
        Alert.alert('Error', 'Failed to load profile data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    // Handle the save button press here
    console.log('Save profile');
    // You would typically make an API call here to save the user's profile
  };
  const handleNameChange = (name) => {
    setProfile(prevState => ({ ...prevState, nama_user: name }));
  };

  const handlePhoneChange = (phone) => {
    setProfile(prevState => ({ ...prevState, no_phone: phone }));
  };

  const handleEmailChange = (email) => {
    setProfile(prevState => ({ ...prevState, email: email }));
  };

  return (
    <ScrollView style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" color="#000" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
      </View>
      
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChoosePhoto}>
        <Image
          style={styles.profilePic}
          source={{ uri: profile.foto_user }}
        />
      </TouchableOpacity>
        {/* Add edit icon here if needed */}
      </View>

      <View style={styles.form}>
        <Text style={styles.textEmail}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={profile.nama_user}
          onChangeText={handleNameChange} // Use the new handler here
          placeholder="Nama Lengkap"
        />
        <Text style={styles.textEmail}>Nomor Handphone</Text>
        <TextInput
          style={styles.input}
          value={profile.no_phone}
          onChangeText={handlePhoneChange} // And here
          placeholder="Nomor Handphone"
          keyboardType="phone-pad"
        />
        <Text style={styles.textEmail}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={handleEmailChange} // And here
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleProfileUpdate}>
        <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center items horizontally in the container
    paddingTop: 50,
    paddingBottom: 10,
    
    // If you have a navigation bar or status bar, you might need to add some padding here
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute', // Positioning the title absolutely to center it in the header
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#000',

  },
  backButton: {
    color: '#000',

    padding: 10, // Optional: if you want to make the back button area larger
    position: 'absolute', // Position the back button absolutely to place it on the left
    left: 10, // Space from the left side
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
    
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    marginHorizontal: 20,
    color: '#000',

  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',

  },
  textEmail: {
    fontSize: 20,
    color: '#000',
    fontStyle: 'normal',

  },
  saveButton: {
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 180,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
