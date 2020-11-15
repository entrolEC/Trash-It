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
  const [lst, setLst] = useState([
    {latitude: 37.564200, longitude: 126.977011},
  ]);

  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};

  const getLocation = () => {
    Geolocation.getCurrentPosition(async position => {
      console.log(JSON.stringify(position))
      const {longitude, latitude} = position.coords
      await setCurrentPosition({
        latitude: latitude,
        longitude: longitude,
      })
      setLoading(false)

    }, error=> console.log(error.message),
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 10000
    }
    )
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

    await fetch("http://112.145.103.184:3000/phone", requestOptions) // i'm stuck on this network failed error. (android)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

      setLoading(false)
    }

  useEffect(() => {
    fetchData()
  })

  return !loading ? (
    <SafeAreaView style={styles.container}>
      <NaverMapView style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        setLocationTrackingMode={2}
        center={{...P0, zoom: 16}}
        onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
        onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
        {

          lst.map((point)=>(
            <Marker coordinate={point} onClick={() => console.warn('onClick! p0')}/>
          ))
        }
      <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')}/>
      <Marker coordinate={P1} pinColor="blue" onClick={() => console.warn('onClick! p1')}/>
      <Marker coordinate={P2} pinColor="red" onClick={() => console.warn('onClick! p2')}/>
      <Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10}/>
      <Polyline coordinates={[P1, P2]} onClick={() => console.warn('onClick! polyline')}/>
      <Circle coordinate={P0} color={"rgba(255,0,0,0.3)"} radius={200} onClick={() => console.warn('onClick! circle')}/>
      <Polygon coordinates={[P0, P1, P2]} color={`rgba(0, 0, 0, 0.5)`} onClick={() => console.warn('onClick! polygon')}/>
      </NaverMapView>
      <FloatingAction
        actions={actions}
        onPressItem={() => {setModalVisible(true)}}
      />
      <AddTrashcan modalVisible={modalVisible} setModalVisible={setModalVisible}/>
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
