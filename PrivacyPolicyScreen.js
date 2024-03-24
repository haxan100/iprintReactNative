import React, { useState, useEffect } from 'react';
import { ScrollView, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import Axios from 'axios';

const PrivacyPolicyScreen = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await Axios.get('https://heyiamhasan.com/porto/iprintNew/Api/kebijakan');
        console.log(response.data.data.isi)
        if (response.data.status) {
          setPrivacyPolicy(response.data.data.isi); // Assume the policy text is in response.data.data
        } else {
          // Handle the case where the status is false
          setPrivacyPolicy('Failed to load privacy policy.');
        }
      } catch (error) {
        // Handle the error case
        setPrivacyPolicy('An error occurred while fetching the privacy policy.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.textContent}>
          <Text style={styles.text}>{privacyPolicy}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContent: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default PrivacyPolicyScreen;
