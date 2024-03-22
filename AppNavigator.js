import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import InfoScreen from './InfoScreen';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{
           headerShown: false
          }}
        >
        <Stack.Screen name="Login" component={LoginScreen} shaw />
        <Stack.Screen name="Home" component={HomeScreen} shaw />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
