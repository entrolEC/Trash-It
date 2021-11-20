/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageModal from 'react-native-image-modal';

import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';
import {getNewToken, getUser} from '../service/UserManager';
import {getGeolocation} from '../service/Geolocation';

import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableHighlight, TouchableWithoutFeedback} from '@gorhom/bottom-sheet'

import {getData} from '../service/AsyncStorage';

import {URL} from '../../env.json';
import {Loading} from './Loading.js';

export const AddTrashcan = ({
  modalVisible,
  setModalVisible,
  loadingVisible,
  setLoadingVisible,
  addBottomSheetModalRef,
}) => {
  const [description, setDescription] = useState('설명 없음');
  const [data, setData] = useState(0);
  const [image, setImage] = useState(null);
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const {pin} = pinState; // included : data, loading, error, success

  const [user, setUser] = useState();

  const fetchData = async () => {
    getPin(pinDispatch);
  };

  const addNewTrashcan = async () => {
    const image = await ImagePicker.openCamera({
      width: 900,
      height: 900,
      includeExif: true,
      cropping: true,
      mediaType: 'photo',
    })

    console.log(image);
    setImage(image);
    await getGeolocation(setIsGeolocationLoaded);
    let temp = {
      address: '인천 송도과학로27번길 15',
      image: {uri: image.path, type: 'image/jpeg', name: ';alkfsdj;ljkasdf'},
    };
    setData(temp);
  };

  const isTrashCan = async () => {
    var formdata = new FormData();
    const accessToken = await getNewToken();
    formdata.append('image', data.image);

    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + accessToken,
      },
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    await fetch(`http://${URL}/check`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log('isTrashCanError', error);
      })
  }

  const initStates = () => {
    setImage(null);
    setIsImageLoading(false);
  };

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

  if (user === null) {
    return (
      <View>
        <Text>로그인을 먼저 해주세요.</Text>
      </View>
    );
  }

  useEffect(() => {
    if (modalVisible && image === null && !isImageLoading) {
      console.log("addNewTrashcan Start!!");
      setIsImageLoading(true);
      addNewTrashcan();
      getUser().then((_user) => {
        console.log('user trashcaninfo', _user);
        setUser(_user.user);
      });
    }
  },[modalVisible])
  

  return (
    <View>
      <View style={{borderBottomWidth: 0.5, borderBottomColor: '#aaaaaa', alignItems: 'center', marginBottom: 10, flexDirection: 'row'}}>
        <Text style={{fontSize: 20, marginBottom: 10, marginLeft: 10}}>핀 추가</Text>
        <TouchableWithoutFeedback
          onPress={async () => {
            setLoadingVisible(true);
            console.log('pressed');
            if (data) {
              console.log('here');
              await postData();
              await fetchData();
              //setTimeout(()=>{ fetchData() }, 1000)
              setData(0);
              setModalVisible(false);
              initStates();

              addBottomSheetModalRef.current.close();
            } else {
              console.log('data is null');
            }
            
          }}
          >
          <Icon name={'cloud-upload-outline'} size={30} color={'#05BCDF'} style={{marginBottom: 5, paddingLeft: Dimensions.get('window').width - 120}} />
        </TouchableWithoutFeedback>
        </View>
      <View>
        <View style={styles.user}>
          {
            user ? (
              <>
              <Image
                source={{
                  uri: user.photo,
                }}
                style={styles.profileimage}
              />
              <View style={{marginLeft: 13, flexDirection: 'column'}}>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>{user.name}</Text>
                <Text>{user.email}</Text>
              </View>
              </>
            ) : null
          }
        </View>

        <View style={styles.itemContainer}>
          <TextInput
            style={{
              height: 80,
            }}
            onChangeText={(text) => setDescription(text)}
            placeholder={'간단한 설명을 부탁드립니다! \n ex) 버스정류장 옆 or ~ 가게 앞'} />
        </View>

        <View style={{alignItems: 'center'}}>
          {
            image ? (
              <ImageModal
                style={styles.image}
                resizeMode="contain"
                source={{
                  uri: image.path,
                }}
              />
            ) : null
          }
          
        </View>
      </View>
      <View>
        <Loading
          loadingVisible={loadingVisible}
          setLoadingVisible={setLoadingVisible} />
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
  itemContainer: {
    marginVertical: 20,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  user: {
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  }
});
