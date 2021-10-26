/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';
import {getNewToken, getUser} from '../service/UserManager';
import {getGeolocation} from '../service/Geolocation';

import Modal from 'react-native-modal';

import {getData} from '../service/AsyncStorage';

import {URL} from '../../env.json';
import {Loading} from './Loading.js';

export const AddTrashcan = ({
  modalVisible,
  setModalVisible,
  loadingVisible,
  setLoadingVisible,
}) => {
  const [description, setDescription] = useState('설명 없음');
  const [data, setData] = useState(0);
  const [image, setImage] = useState();
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(0);

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const {pin} = pinState; // included : data, loading, error, success

  const [user, setUser] = useState();

  const fetchData = async () => {
    getPin(pinDispatch);
  };

  const addNewTrashcan = () => {
    ImagePicker.openCamera({
      width: 900,
      height: 900,
      includeExif: true,
      cropping: true,
      mediaType: 'photo',
    }).then((image) => {
      console.log(image);
      setImage(image);
      getGeolocation(setIsGeolocationLoaded);
      //getPosition(positionDispatch);
    });
  };

  useEffect(() => {
    if (image) {
      let temp = {
        address: '인천 송도과학로27번길 15',
        image: {uri: image.path, type: 'image/jpeg', name: ';alkfsdj;ljkasdf'},
      };
      setData(temp);
    }
  }, [image]);

  const postData = async () => {
    var formdata = new FormData();
    console.log('here1');
    const accessToken = await getNewToken();
    console.log('addtrashcan postdata', accessToken);
    formdata.append('latitude', isGeolocationLoaded.latitude);
    formdata.append('longitude', isGeolocationLoaded.longitude);
    formdata.append('address', data.address);
    formdata.append('image', data.image);
    formdata.append('description', description);
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + accessToken,
      },
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    await fetch(`http://${URL}/locations/`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setLoadingVisible(false);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getUser().then((_user) => {
      console.log('user trashcaninfo', _user);
      setUser(_user.user);
    });
  }, []);

  if (user === null) {
    return (
      <View>
        <Text>
          로그인을 먼저 해주세요.
        </Text>
      </View>
    )
  }
  return (
    <View>
      <View style={styles.centeredView}>
        <Modal
          animationIn="pulse"
          animationInTiming={500}
          animationOut="bounceOutDown"
          animationOutTiming={500}
          transparent={true}
          isVisible={modalVisible}
          backdropColor="none"
          onBackButtonPress={() => {
            setModalVisible(!modalVisible);
          }}
          onBackdropPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                현재 위치에 쓰레기통을 추가합니다.
              </Text>
              <View style={styles.itemsContainer}>
                <View style={{...styles.itemContainer, flexDirection: 'row'}}>
                  <Text style={styles.itemText}>이미지</Text>
                  <TouchableHighlight
                    style={styles.cameraButton}
                    onPress={() => {
                      addNewTrashcan();
                    }}>
                    <Text style={styles.textStyle}> 촬영 </Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>설명</Text>
                  <TextInput
                    style={{
                      height: 80,
                      borderColor: '#aaaaaa',
                      borderWidth: 0.5,
                      borderRadius: 10,
                    }}
                    onChangeText={(text) => setDescription(text)}
                    placeholder={
                      '간단한 설명을 부탁드립니다! \n ex) 버스정류장 옆 or ~ 가게 앞'
                    }
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight
                    style={{...styles.openButton, backgroundColor: '#2196F3'}}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}> 취소 </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{...styles.openButton, backgroundColor: '#2196F3'}}
                    onPress={async () => {
                      setLoadingVisible(true);
                      console.log('pressed');
                      if (data) {
                        console.log('here');

                        await postData();
                        await fetchData();
                        //setTimeout(()=>{ fetchData() }, 1000)
                        setData(0);
                        setModalVisible(!modalVisible);
                      } else {
                        console.log('data is null');
                      }
                    }}>
                    <Text style={styles.textStyle}> 확인 </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View>
        <Loading
          loadingVisible={loadingVisible}
          setLoadingVisible={setLoadingVisible}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2,
    marginHorizontal: 13,
    width: 100,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 18,
  },
  itemText: {
    marginBottom: 10,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    //alignContent: "space-around"
    justifyContent: 'space-around',
  },
  itemContainer: {
    marginVertical: 20,
  },
  itemsContainer: {
    padding: 10,
  },
  cameraButton: {
    backgroundColor: '#41B6FF',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    width: 100,
    marginLeft: 130,
  },
});
