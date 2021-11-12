import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import { SplashScreen } from './src/scenes/SplashScreen';
import { UserProvider } from './src/context/UserContext';
import { PinProvider } from './src/context/PinContext';
import {hasLocationPermission} from './src/service/Permission';
import {Alert} from './src/components/Alert';

export default App = () => { 
  const [permissionLoaded, setPermissionLoaded] = useState(0);
  const [backAlertVisible, setBackAlertVisible] = useState(false);
  // get location permission
  useEffect(() => {

    const getLocationPermission = async () => {
      const hasPermission =await hasLocationPermission();
      setPermissionLoaded(hasPermission);
    }
    
    const backAction = () => {
      setBackAlertVisible(true)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    getLocationPermission();

    return () => backHandler.remove();
  },[]);

  useEffect(() => {console.log("permissionLoaded", permissionLoaded)},[permissionLoaded]);

  if(permissionLoaded) {
    return (
      <UserProvider>
        <PinProvider>
          <Alert
            alertVisible={backAlertVisible}
            setAlertVisible={setBackAlertVisible}
            title={''}
            message={'앱을 종료하시겠습니까?'}
            showCancel={true}
            confirmText={'확인'}
            cancelText={'취소'}
            callback={() => BackHandler.exitApp()} // not working in ios
          />
          <SplashScreen/>
        </PinProvider>
      </UserProvider>
    )
  } else {
    return (<></>);
  }
}