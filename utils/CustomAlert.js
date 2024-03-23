import { Alert } from 'react-native';

const CustomAlert = {
  showAlert: (title, message) => {
    Alert.alert(title, message, [
      { text: 'OK' }
    ]);
  }
};

export default CustomAlert;