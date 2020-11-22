import React,{useEffect, useState} from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import App from './App';
import Geolocation from '@react-native-community/geolocation';
import PositionContext from '../context/PositionContext'

const initialState = {
  latitude: 37.3677,
  longitude: 126.6603,
}

export default SplashScreen = () => {

  const [trashcanLocation, setTrashcanLocation] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  

  const getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      console.log(JSON.stringify(position))
      const {longitude, latitude} = position.coords
      await setCurrentPosition({
        latitude: latitude,
        longitude: longitude,
      })
      setTimeout(()=>{ setIsLoaded(true) }, 1000)
    })
  }

  const fetchData = async () => {
    console.log("fetchdata!")

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    await fetch("http://112.145.103.184:8000/locations/", requestOptions) // i'm stuck on this network failed error. (android)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setTrashcanLocation(result)
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fetchData()
    getLocation()
  },[])

  return(
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded}
      logoImage={require("../assets/logo/logo.png")}
      backgroundColor={"#262626"}
      logoHeight={300}
      logoWidth={300}
    >
      <PositionContext.Provider value={{currentPosition, setCurrentPosition, trashcanLocation, setTrashcanLocation}}>
        <App/>
      </PositionContext.Provider>
    </AnimatedSplash>
  )
}