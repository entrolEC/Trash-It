import React, {useEffect, useState} from 'react';
import { Text } from 'react-native';
import { SplashScreen } from './src/scenes/SplashScreen';
import { UserProvider } from './src/context/UserContext';
import { PinProvider } from './src/context/PinContext';
import {getLocationPermission, hasLocationPermission} from './src/service/Permission';

export default App = () => { 
  const [permissionLoaded, setPermissionLoaded] = useState(0);
  // get location permission
  useEffect(() => {
    if(!hasLocationPermission()) {
      if(getLocationPermission()){}
        setPermissionLoaded(1);
    } else {
      setPermissionLoaded(1);
    }
  },[]);

  if(permissionLoaded) {
    return (
      <UserProvider>
        <PinProvider>
          <SplashScreen/>
        </PinProvider>
      </UserProvider>
    )
  } else {
    return (<></>);
  }
}