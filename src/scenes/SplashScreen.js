import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {MapScreen} from './MapScreen';
import Geolocation from 'react-native-geolocation-service';
import {
  useUserState,
  useUserDispatch,
  getUser,
  UserContext,
} from '../context/UserContext';
import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';
import {UsersProvider} from '../context/UserContext';
import {set} from 'react-native-reanimated';
import {Alert} from '../components/Alert';
import {getGeolocation} from '../service/Geolocation';

import LottieView from 'lottie-react-native';

import {URL} from '../../env.json';

const initialState = {
  latitude: 37.3677,
  longitude: 126.6603,
};

export const SplashScreen = () => {
  //const [user, setUser] = useState({token: null, username: '로그인되지 않음'});
  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedtrashcan, setSelectedtrashcan] = useState([]);
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(0);

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  //const { data: user, loading, error, success } = userState.user;
  const {user} = userState;

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
    // setIsLoaded(isLoaded + 1);
    console.log('loading ... ', isLoaded);
    console.log('current', currentPosition);
  }, [trashcanLocation, currentPosition]);

  return (
    <>
      {isLoaded === true && isGeolocationLoaded !== 0 && pin.success ? (
        <MapScreen
          latitude={isGeolocationLoaded.latitude}
          longitude={isGeolocationLoaded.longitude}
        />
      ) : (
        <LottieView
          source={require('../assets/splash.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => {
            if (trashcanLocation) {
              setIsLoaded(true);
            }
          }}
          style={{backgroundColor: '#73B5CE'}}
        />
      )}
    </>
  );
};
