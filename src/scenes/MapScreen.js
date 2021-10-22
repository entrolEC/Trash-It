/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
  Button,
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
import {BottomSheetComponent} from '../components/BottomSheetComponent';
import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';
import {
  useUserState,
  useUserDispatch,
  getUser,
  UserContext,
} from '../context/UserContext';

import {FloatingButton} from '../components/FloatingButton';
import {Modalize} from 'react-native-modalize';

import { getData } from '../service/AsyncStorage';
import {URL} from '../../env.json';

export const MapScreen = ({latitude, longitude}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const {user} = userState; // included : data, loading, error, success

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const {pin} = pinState; // included : data, loading, error, success

  const modalizeRef = useRef<Modalize>(null);

  const onClicked = (point, idx) => {
    console.log('clicked', point, idx);
    setSelectedIndex(idx);
    setSelectedId(point.id);
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
        console.log('clicked result', result);
        setSelectedtrashcan(result);
      })
      .catch((error) => console.log('error', error));
  };

  const menuPressed = (name) => {
    const userData = getData('user');
    if (name === 'login') {
      setAuthModalVisible(true);
    } else if (name === 'addTrashcan') {
      if (userData === null) {
        setAlertVisible(true);
      } else {
        setModalVisible(true);
      }
    } else if (name === 'leaderBoard') {
      setLeaderBoardVisible(true);
    }
  };

  useEffect(() => {
    setSelectedIndex(null);
  }, [])

  return (
    <>
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
              key={idx}
              coordinate={point}
              onClick={async () => {
                //await fetchData(point);
                await onClicked(point, idx);
                modalizeRef.current?.open();
              }}
            />
          ))}
      </NaverMapView>

      {selectedIndex !== null ? (
        <Modalize
          ref={modalizeRef}
          snapPoint={500}
          handlePosition={'inside'}
          closeSnapPointStraightEnabled={false}
          modalStyle={{borderTopLeftRadius: 30, borderTopRightRadius: 30}}
          withOverlay={false}
          onClose={() => {
            setSelectedIndex(null);
            setSelectedId(null);
            console.log(selectedIndex);
            // console.log(`this is trashcanLocation`, selectedTrashcan);
            //addNewTrashcan()
          }}>
          <TrashcanInfo
            modalVisible={infoModalVisible}
            setModalVisible={setInfoModalVisible}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            alertVisible={alertVisible}
            setAlertVisible={setAlertVisible}
          />
        </Modalize>
      ) : (
        <FloatingButton
        onPressItem={(name) => {
          menuPressed(name);
        }}
      />
      )}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
