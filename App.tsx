import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNavigator from './AppNavigator'; // Ini adalah navigator yang berisi konfigurasi screen

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;