import React from 'react';
import { View, Text, Button } from 'react-native';

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Go to Info"
        onPress={() => navigation.navigate('Info')}
      />
    </View>
  );
}

export default ProfileScreen;
