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

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/Ionicons';
import { AddTrashcan } from '../components/AddTrashcan'
import data from '../../dummy/data.json'
import {TrashcanInfo} from '../components/TrashcanInfo'
import PositionContext from '../context/PositionContext'
import {Auth} from '../components/Auth'
import {Alert} from '../components/Alert'

const actions = [
  {
    text: "쓰레기통 추가",
    icon: <Icon name="trash" color="#fff" size={24}></Icon>,
    name: "addTrashcan",
    position: 2,
    color: "#666666"
  },
  {
    text: "로그인",
    icon: <Icon name="trash" color="#fff" size={24}></Icon>,
    name: "login",
    position: 3,
    color: "#666666"
  }
];

export const MapScreen = ({navigation}) => {

  const { currentPosition, setCurrentPosition } = React.useContext(PositionContext)
  const { user, setUser } = React.useContext(PositionContext)
  const { trashcanLocation, setTrashcanLocation } = React.useContext(PositionContext)
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const onClicked = (idx) =>{
    setSelectedIndex(idx)
    setInfoModalVisible(true)
  }

  const menuPressed = (name) => {
    if(name == 'login') {
      setAuthModalVisible(true) 
    } else if(name == 'addTrashcan') { 
      if(user.token == null) {
        setAlertVisible(true)
      } else {
        setModalVisible(true)
      }
    }
  }

  return(
    <SafeAreaView style={styles.container}>
      <NaverMapView style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        setLocationTrackingMode={2}
        center={{...currentPosition, zoom: 16}}
        //onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        //onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}
        
        //onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
      >
        {
          trashcanLocation.map((point, idx)=>(
            <Marker key={point.key} coordinate={point} onClick={()=>{onClicked(idx)}}/>
          ))
        }

      </NaverMapView>
      <FloatingAction
        actions={actions}
        color={"#666666"}
        onPressItem={name => {menuPressed(name)}}
      />
      
      {
        selectedIndex!==null ? (
          <TrashcanInfo modalVisible={infoModalVisible} setModalVisible={setInfoModalVisible} selectedIndex={selectedIndex}/>
        ) : (
          null
        )
      }
      <AddTrashcan modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      <Auth authModalVisible={authModalVisible} setAuthModalVisible={setAuthModalVisible}/>
      <Alert alertVisible={alertVisible} setAlertVisible={setAlertVisible}/>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
  }
});
