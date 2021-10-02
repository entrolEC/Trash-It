import React,{useEffect, useState} from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import {MapScreen} from './MapScreen';
import Geolocation from '@react-native-community/geolocation';
import PositionContext from '../context/PositionContext'
import { set } from 'react-native-reanimated';

const initialState = {
  latitude: 37.3677,
  longitude: 126.6603,
}

export default SplashScreen = () => {

  const [user, setUser] = useState({'token': null, 'username' : '로그인되지 않음'});
  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(0);

  const getLocation = () => {
    Geolocation.getCurrentPosition(position => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }) 
    },
    error => console.log(error),
    { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 })
    
  }

  const fetchData = () => {
    console.log("fetchdata!")

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("http://192.168.219.106:8000/locations/", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setTrashcanLocation(result)
        //setTimeout(()=>{ setIsLoaded(true) }, 1000)
      })
      .catch(error => console.log('error', error));
  }


  useEffect(() => {
    fetchData()
    getLocation()
  },[])

  useEffect(() => {
    setIsLoaded(isLoaded + 1);
    console.log('loading ... ')
    console.log("current", currentPosition)
  },[trashcanLocation, currentPosition])

  return(
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded === 2}
      logoImage={require("../assets/logo/logo.png")}
      backgroundColor={"#262626"}
      logoHeight={300}
      logoWidth={300}
    >
      <PositionContext.Provider value={{currentPosition, setCurrentPosition, trashcanLocation, setTrashcanLocation, user, setUser}}>
        <MapScreen/>
      </PositionContext.Provider>
    </AnimatedSplash>
  )
}