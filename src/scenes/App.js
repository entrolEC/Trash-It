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
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/Ionicons';
import { AddTrashcan } from '../components/AddTrashcan'
import data from '../../dummy/data.json'
import {TrashcanInfo} from '../components/TrashcanInfo'
import PositionContext from '../context/PositionContext'

const actions = [
  {
    text: "쓰레기통 추가",
    icon: <Icon name="trash" color="#fff" size={24}></Icon>,
    name: "bt_accessibility",
    position: 2,
    color: "#666666"
  }
];

const App = ({trashcanLocation}) => {

  const { currentPosition, setCurrentPosition } = React.useContext(PositionContext)
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const onClicked = (idx) =>{
    setSelectedIndex(idx)
    setInfoModalVisible(true)
  }

  return(
    <SafeAreaView style={styles.container}>
      <NaverMapView style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        setLocationTrackingMode={2}
        center={{...currentPosition, zoom: 16}}
        //onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        //onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
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
        onPressItem={() => {setModalVisible(true)}}
      />
      
      {
        selectedIndex!==null ? (
          <TrashcanInfo modalVisible={infoModalVisible} setModalVisible={setInfoModalVisible} trashcanLocation = {trashcanLocation[selectedIndex]}/>
        ) : (
          null
        )
      }
      <AddTrashcan modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
  }
});

export default App;
