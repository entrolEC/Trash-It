import React, {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {MapScreen} from './MapScreen';
import Geolocation from 'react-native-geolocation-service';
import PositionContext from '../context/PositionContext';
import {set} from 'react-native-reanimated';
import {Alert} from '../components/Alert';

import {URL} from '../../env.json';

const initialState = {
  latitude: 37.3677,
  longitude: 126.6603,
};

export default SplashScreen = () => {
  const [user, setUser] = useState({token: null, username: '로그인되지 않음'});
  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedtrashcan, setSelectedtrashcan] = useState([]);

  const getLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'TrashIt 위치 권한 요청',
          message: '사용자의 위치 권한이 필요합니다.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        setHasLocationPermission(true);
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    getLocationPermission();
  };

  const fetchData = () => {
    console.log('fetchdata!');

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`http://${URL}/pin/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setTrashcanLocation(result);
        //setTimeout(()=>{ setIsLoaded(true) }, 1000)
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    fetchData();
    getLocation();
    setIsLoaded(0);
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [hasLocationPermission]);

  useEffect(() => {
    setIsLoaded(isLoaded + 1);
    console.log('loading ... ', isLoaded);
    console.log('current', currentPosition);
  }, [trashcanLocation, currentPosition]);

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded > 2}
      logoImage={require('../assets/logo/logo.png')}
      backgroundColor={'#262626'}
      logoHeight={300}
      logoWidth={300}>
      <PositionContext.Provider
        value={{
          currentPosition,
          setCurrentPosition,
          trashcanLocation,
          setTrashcanLocation,
          user,
          setUser,
          selectedtrashcan,
          setSelectedtrashcan,
        }}>
        <MapScreen />
      </PositionContext.Provider>
    </AnimatedSplash>
  );
};
