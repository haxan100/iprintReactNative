import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import InfoScreen from './InfoScreen';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import LupaPasswordScreen from './ForgotPasswordScreen';
import VerificationScreen from './VerificationScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import PrintOnlyScreen from './PrintOnlyScreen';
import PreviewScreen from './PreviewScreen';
import PrintOnlyLanjutanScreen from './PrintOnlyLanjutanScreen';
import CartScreen from './CartScreen';
import SettingsScreen from './SettingsScreen';
import EditProfileScreen from './EditProfileScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import TentangScreen from './TentangScreen';
import HistoryScreen from './HistoryScreen';
import NotificationScreen from './NotificationScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import PrintCutScreen from './PrintCutScreen';
import PreviewCutScreen from './PreviewCutScreen';
import PrintCutLanjutanScreen from './PrintCutLanjutanScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Beranda') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'HistoryScreen') {
            iconName = 'history';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Pengaturan') {
            iconName = focused ? 'cog' : 'cog-outline'; // Menggunakan 'cog' sebagai alternatif untuk settings
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false, // Set to false to hide labels
        tabBarStyle: {
          // Your custom style
          height: 60, // Example height, adjust as needed
          paddingBottom: 5, // Adjust padding as needed
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} options={{ tabBarLabel: 'Beranda' }} />
      <Tab.Screen name="HistoryScreen" component={HistoryScreen} options={{ tabBarLabel: 'HistoryScreen' }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ tabBarLabel: 'Notifikasi' }} />
      <Tab.Screen name="Pengaturan" component={SettingsScreen} options={{ tabBarLabel: 'Pengaturan' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="LupaPassword" component={LupaPasswordScreen} />
        <Stack.Screen name="Verifikasi" component={VerificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="PrintOnly" component={PrintOnlyScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="PrintOnlyLanjutan" component={PrintOnlyLanjutanScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Setting" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Tentang" component={TentangScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="PrintCut" component={PrintCutScreen} />
        <Stack.Screen name="PreviewCut" component={PreviewCutScreen} />
        <Stack.Screen name="PrintCutLanjutan" component={PrintCutLanjutanScreen} />
        {/* Tidak perlu menambahkan Profile dan Info lagi di sini */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
