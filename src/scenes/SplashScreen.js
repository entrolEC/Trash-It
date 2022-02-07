import React, {useEffect, useState} from 'react';
import {BackHandler, LogBox} from 'react-native';
import {MapScreen} from './MapScreen';
import {usePinState, usePinDispatch, getPin} from '../context/PinContext';
import {Alert} from '../components/Alert';
import {getGeolocation} from '../service/Geolocation';

import LottieView from 'lottie-react-native';

LogBox.ignoreAllLogs();

export const SplashScreen = () => {
  //const [user, setUser] = useState({token: null, username: '로그인되지 않음'});
  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPinLoaded, setIsPinLoaded] = useState(false);
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(0);
  const [showConnectionAlert, setShowConnectionAlert] = useState(false); // 인터넷 연결 실패 경고창 보임 여부

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  //const { data: user, loading, error, success } = userState.user;
  const {pin} = pinState;

  useEffect(() => {
    getGeolocation(setIsGeolocationLoaded);
  }, []);

  useEffect(() => {
    getPin(pinDispatch);
  }, [pinDispatch]);

  useEffect(() => {
    console.log('pinerror:', pin.error);
    if (isLoaded) {
      setTimeout(() => {
        if (!pin.success) {
          setShowConnectionAlert(true);
        }
      }, 5000);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (pin.success) {
      setIsPinLoaded(true);
    }
  }, [pin.success]);

  return (
    <>
      {isLoaded === true && isGeolocationLoaded !== 0 && isPinLoaded ? (
        <MapScreen
          latitude={isGeolocationLoaded.latitude}
          longitude={isGeolocationLoaded.longitude}
        />
      ) : (
        <>
          <LottieView
            source={require('../assets/lottie/splash.json')}
            autoPlay
            loop={false}
            onAnimationFinish={() => {
              if (trashcanLocation) {
                setIsLoaded(true);
              }
            }}
            style={{backgroundColor: '#73B5CE'}}
          />
          <Alert
            alertVisible={showConnectionAlert}
            setAlertVisible={setShowConnectionAlert}
            title={'인터넷 없음'}
            message={'인터넷 연결을 확인하고 \n앱을 다시 실행해주세요!'}
            confirmText={'알겠어요!'}
            callback={() => BackHandler.exitApp()} // not working in ios
          />
        </>
      )}
    </>
  );
};
