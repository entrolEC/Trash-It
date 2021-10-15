import React, {useEffect, useState} from 'react';
import {Text} from 'react-native'
import AnimatedSplash from 'react-native-animated-splash-screen';
import {MapScreen} from './MapScreen';
import Geolocation from 'react-native-geolocation-service';
import {useUserState, useUserDispatch, getUser, UserContext} from '../context/UserContext';
import {usePinState, usePinDispatch, getPin, PinContext} from '../context/PinContext';
import {UsersProvider} from '../context/UserContext';
import {set} from 'react-native-reanimated';
import {Alert} from '../components/Alert';
import { getGeolocation } from '../service/Georocation'

import {URL} from '../../env.json';

const initialState = {
  latitude: 37.3677,
  longitude: 126.6603,
};

export const SplashScreen = () => {
  //const [user, setUser] = useState({token: null, username: '로그인되지 않음'});
  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedtrashcan, setSelectedtrashcan] = useState([]);
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(0);

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  //const { data: user, loading, error, success } = userState.user;
  const { user } = userState;

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  //const { data: user, loading, error, success } = userState.user;
  const { pin } = pinState;

  useEffect(() => {
    getGeolocation(setIsGeolocationLoaded);
  }, []);

  useEffect(() => {
    getPin(pinDispatch);
  }, [pinDispatch]);

  if(pin.success) {
    console.log("pin", pin.data)
  }

  // const getLocation = () => {
  //   getLocationPermission();
  // };

  // const fetchData = () => {
  //   console.log('fetchdata!');

  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow',
  //   };

  //   fetch(`http://${URL}/pin/`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       // console.log(result);
  //       setTrashcanLocation(result);
  //       //setTimeout(()=>{ setIsLoaded(true) }, 1000)
  //     })
  //     .catch((error) => console.log('error', error));
  // };

  // useEffect(() => {
  //   fetchData();
  //   getLocation();
  //   setIsLoaded(0);
  // }, []);

  // useEffect(() => {
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         setCurrentPosition({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //       },
  //       (error) => console.log(error),
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   }
  // }, [hasLocationPermission]);

  // useEffect(() => {
  //   setIsLoaded(isLoaded + 1);
  //   console.log('loading ... ', isLoaded);
  //   console.log('current', currentPosition);
  // }, [trashcanLocation, currentPosition]);

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isGeolocationLoaded && pin.success}
      logoImage={require('../assets/logo/logo.png')}
      backgroundColor={'#262626'}
      logoHeight={300}
      logoWidth={300}>
        {isGeolocationLoaded!==0 && pin.success && (<MapScreen latitude={isGeolocationLoaded.latitude} longitude={isGeolocationLoaded.longitude}/>)}
    </AnimatedSplash>
  );
};
