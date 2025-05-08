import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this package installed
import RenderHtml from 'react-native-render-html';
import BASE_URL from './config';

const PrivacyPolicyScreen = ({onBackPress, navigation}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await Axios.get(
          BASE_URL.BASE_URL+'kebijakan',
        );
        console.log(response.data.data.isi);
        if (response.data.status) {
          setPrivacyPolicy(response.data.data.isi); // Assume the policy text is in response.data.data
        } else {
          // Handle the case where the status is false
          setPrivacyPolicy('Failed to load privacy policy.');
        }
      } catch (error) {
        // Handle the error case
        setPrivacyPolicy(
          'An error occurred while fetching the privacy policy.',
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);
  const source = {
    html: privacyPolicy,
  };
  const {width} = useWindowDimensions();
  const tagsStyles = {
    body: {color: 'black'}, // Ubah warna teks menjadi hitam atau warna yang diinginkan
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{flex: 1}} />
      ) : (
        <ScrollView style={styles.contentContainer}>
          <RenderHtml
            contentWidth={width}
            tagsStyles={tagsStyles}
            source={source}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding:20
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // Remove alignContent when using justifyContent and alignItems
  },
  textContent: {
    // Remove flex and alignContent from here
    padding: 16,
    justifyContent: 'center', // This will have no effect on a non-flex container

    alignItems: 'center', // Centers items horizontally in the container
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center', // Centers text horizontally in the Text component
    // For Android, the following property will center the text vertically
    textAlignVertical: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    flex: 1, // This will ensure the title is centered by pushing the back icon to the left
    textAlign: 'center', // This will center the title text if there's no icon on the right
  },
  textAtas: {
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 10,
  },
});

export default PrivacyPolicyScreen;
