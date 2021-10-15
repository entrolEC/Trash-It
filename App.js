import React, {useEffect} from 'react';
import { Text } from 'react-native';
import { SplashScreen } from './src/scenes/SplashScreen';
import { UserProvider } from './src/context/UserContext';
import { PinProvider } from './src/context/PinContext';
import getLocationPermission from './src/service/Permission';

export default App = () => { 
  // get location permission
  getLocationPermission();

  return (
    <UserProvider>
      <PinProvider>
        <SplashScreen/>
      </PinProvider>
    </UserProvider>
  )
}