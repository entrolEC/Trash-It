/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
//import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/Ionicons';
import { AddTrashcan } from '../components/AddTrashcan'
import data from '../../dummy/data.json'

const actions = [
  {
    text: "쓰레기통 추가",
    icon: <Icon name="trash" color="#fff" size={24}></Icon>,
    name: "bt_accessibility",
    position: 2
  }
];

const initialState = {
  latitude: null,
  longitude: null,
}

const App = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [trashcanLocation, setTrashcanLocation] = useState([]);

  const getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      console.log(JSON.stringify(position))
      const {longitude, latitude} = position.coords
      await setCurrentPosition({
        latitude: latitude,
        longitude: longitude,
      })
      setLoading(false)
    })
  }

  const fetchData = async () => {
    console.log("fetchdata!")

    //.catch(err=>{console.log(err)})
    //.then((request) => request.text())
    //.then((requestTxt)=> {console.log(requestTxt)})

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

  return !loading ? (
    <SafeAreaView style={styles.container}>
      <NaverMapView style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        setLocationTrackingMode={2}
        center={{...currentPosition, zoom: 16}}
        onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
        onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
        {

          trashcanLocation.map((point, idx)=>(
            <Marker coordinate={point} onClick={() => console.warn(`onClicked ${idx}`)}/>
          ))
        }
      </NaverMapView>
      <FloatingAction
        actions={actions}
        onPressItem={() => {setModalVisible(true)}}
      />
      <AddTrashcan modalVisible={modalVisible} setModalVisible={setModalVisible} currentPosition={currentPosition}/>
    </SafeAreaView>
  ) : (
    <Text>loading!!</Text>
  )
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
  }
});

export default App;
