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

import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/Ionicons';
import {AddTrashcan} from '../components/AddTrashcan';
import data from '../../dummy/data.json';
import {TrashcanInfo} from '../components/TrashcanInfo';
import {Auth} from '../components/Auth';
import {Alert} from '../components/Alert';
import {LeaderBoard} from '../components/LeaderBoard';
import {usePinState, usePinDispatch, getPin, PinContext} from '../context/PinContext';
import {useUserState, useUserDispatch, getUser, UserContext} from '../context/UserContext';

import {URL} from '../../env.json';

const actions = [
  {
    text: '리더보드',
    icon: <Icon name="trophy-outline" color="#fff" size={24}></Icon>,
    name: 'leaderBoard',
    position: 2,
    color: '#666666',
  },
  {
    text: '쓰레기통 추가',
    icon: <Icon name="trash" color="#fff" size={24}></Icon>,
    name: 'addTrashcan',
    position: 3,
    color: '#666666',
  },
  {
    text: '로그인',
    icon: <Icon name="person-circle-outline" color="#fff" size={24}></Icon>,
    name: 'login',
    position: 4,
    color: '#666666',
  },
];

export const MapScreen = ({latitude, longitude}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const { user } = userState; // included : data, loading, error, success

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const { pin } = pinState; // included : data, loading, error, success

  const onClicked = (point, idx) => {
    console.log("clicked", point, idx);
    setSelectedIndex(idx);
    setSelectedId(point.id)
    setInfoModalVisible(true);
  };

  const fetchData = async (point) => {
    // console.log('fetchData', point);
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(`http://${URL}/locations/${point.id}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("clicked result", result)
        setSelectedtrashcan(result);
      })
      .catch((error) => console.log('error', error));
  };

  const menuPressed = (name) => {
    if (name == 'login') {
      setAuthModalVisible(true);
    } else if (name == 'addTrashcan') {
      if (user.success===false) {
        setAlertVisible(true);
      } else {
        setModalVisible(true);
      }
    } else if (name == 'leaderBoard') {
      setLeaderBoardVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        setLocationTrackingMode={2}
        center={{latitude: latitude, longitude: longitude, zoom: 16}}
        //onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        //onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}

        //onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
      >
        {pin.data &&
          pin.data.map((point, idx) => (
            <Marker
              key={point.key}
              coordinate={point}
              onClick={() => {
                //await fetchData(point);
                onClicked(point, idx);
              }}
            />
          ))}
      </NaverMapView>
      <FloatingAction
        actions={actions}
        color={'#666666'}
        onPressItem={(name) => {
          menuPressed(name);
        }}
      />

      {selectedIndex !== null ? (
        <TrashcanInfo
          modalVisible={infoModalVisible}
          setModalVisible={setInfoModalVisible}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ) : null}
      <AddTrashcan
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Auth
        authModalVisible={authModalVisible}
        setAuthModalVisible={setAuthModalVisible}
      />
      <Alert
        alertVisible={alertVisible}
        setAlertVisible={setAlertVisible}
        message={'로그인을 먼저 해주세요!'}
      />
      <LeaderBoard
        leaderBoardVisible={leaderBoardVisible}
        setLeaderBoardVisible={setLeaderBoardVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
