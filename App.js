import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import { SplashScreen } from './src/scenes/SplashScreen';
import { UserProvider } from './src/context/UserContext';
import { PinProvider } from './src/context/PinContext';
import {getLocationPermission, hasLocationPermission} from './src/service/Permission';
import {Alert} from './src/components/Alert';

export default App = () => { 
  const [permissionLoaded, setPermissionLoaded] = useState(0);
  const [backAlertVisible, setBackAlertVisible] = useState(false);
  // get location permission
  useEffect(() => {
    if(!hasLocationPermission()) {
      if(getLocationPermission()){}
        setPermissionLoaded(1);
    } else {
      setPermissionLoaded(1);
    }

    const backAction = () => {
      setBackAlertVisible(true)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  },[]);

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