/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {URL} from '../../env.json';

import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';

import ImageModal from 'react-native-image-modal';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';

import LottieView from 'lottie-react-native';

import { getData } from '../service/AsyncStorage';
import { getNewToken, getUser } from '../service/UserManager';

export const TrashcanInfo = ({
  modalVisible,
  setModalVisible,
  selectedIndex,
  setSelectedIndex,
  selectedId,
  setSelectedId,
  alertVisible,
  setAlertVisible,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedTrashcan, setSelectedTrashcan] = useState();
  const [user, setUser] = useState();

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const {pin} = pinState; // included : data, loading, error, success

  const [likes, setLikes] = useState(0);
  const [dislikes, setDisLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(false);
  const [userDisLikes, setUserDisLikes] = useState(false);

  const likeAnimation = useRef(null);
  const disLikeAnimation = useRef(null);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [likeTextColor, setLikeTextColor] = useState('#000000');

  // 처음에는 {user}에게서 가장 가까운 쓰레기통을 bottomsheet로 띄워줌
  // drag up 시 상세정보 표시
  // 다른 핀을 눌렀을 시에는 그 핀에 대한 상세정보를 bottomsheet로 띄움
  useEffect(() => {
    getUser().then((_user) => {
      console.log("user trashcaninfo",_user);
      setUser(_user.user);

      console.log('trashcaninfo');
      const getSelectedTrashcan = async () => {
        var requestOptions = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          method: 'GET',
          redirect: 'follow',
        };
        // params에 user.id를 넘겨줘서 이미 좋아요가 되있는지 확인(userLikes, userDisLikes)
        const params = (_user.user != null ? _user.user.id : -1);
        console.log('trashcaninfo_user', _user.user);
        await fetch(`http://${URL}/locations/${selectedId}/?user_id=${params}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('getSelectedTrashcan', result);
          setSelectedTrashcan(result);
          setLikes(result.likes);
          setDisLikes(result.dislikes);
          setUserLikes(result.userLikes);
          setUserDisLikes(result.userDisLikes);
          setLoading(false); // 로딩 제대로 작동 함.

          if (userLikes) setLikeTextColor('#00ADB5');
          else if (userDisLikes) setLikeTextColor('#F05945');
          else if (!userLikes && !userDisLikes) setLikeTextColor('#000000');

          if (isFirstRun) {
            if (result.userLikes) likeAnimation.current.play(48, 48);
            else likeAnimation.current.play(0, 0);
            if (result.userDisLikes) disLikeAnimation.current.play(50, 50);
            else disLikeAnimation.current.play(0, 0);

            setIsFirstRun(false);
          }
        })
        .catch((error) => console.log('error', error, isFirstLoad));
        setIsFirstLoad(false);
      };

      if (modalVisible === true) getSelectedTrashcan();
    });
  },[modalVisible, userLikes, userDisLikes]);

  const reloadPinData = async () => {
    getUser().then((_user) => {
      setUser(_user.user);

      console.log('trashcaninfo');
      const getSelectedTrashcan = async () => {
        var requestOptions = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          method: 'GET',
          redirect: 'follow',
        };
        // params에 user.id를 넘겨줘서 이미 좋아요가 되있는지 확인(userLikes, userDisLikes)
        const params = (_user.user != null ? _user.user.id : -1);
        console.log('trashcaninfo_user', _user.user);
        await fetch(`http://${URL}/locations/${selectedId}/?user_id=${params}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('getSelectedTrashcan', result);
          setSelectedTrashcan(result);
          setLikes(result.likes);
          setDisLikes(result.dislikes);
          setUserLikes(result.userLikes);
          setUserDisLikes(result.userDisLikes);
          setLoading(false); // 로딩 제대로 작동 함.

          if (userLikes) setLikeTextColor('#00ADB5');
          else if (userDisLikes) setLikeTextColor('#F05945');
          else if (!userLikes && !userDisLikes) setLikeTextColor('#000000');

          if (isFirstRun) {
            if (result.userLikes) likeAnimation.current.play(48, 48);
            else likeAnimation.current.play(0, 0);
            if (result.userDisLikes) disLikeAnimation.current.play(50, 50);
            else disLikeAnimation.current.play(0, 0);

            setIsFirstRun(false);
          }
        })
        .catch((error) => console.log('error', error));
      };
      if (modalVisible === true) getSelectedTrashcan();
    });
  };

  const refreshData = async () => {
    getPin(pinDispatch);
  };

  const deleteData = async () => {
    console.log('selectedIndex.id', selectedTrashcan.id);
    const accessToken = await getNewToken();
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + accessToken,
      },
      method: 'DELETE',
      redirect: 'follow',
    };

    await fetch(`http://${URL}/locations/${selectedId}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('log', result);
      })

      .catch((error) => console.log('error', error));
  };

  const postActions = async (action) => {
    if (user == null) {
      setAlertVisible(true);
    }
    else {
      var formdata = new FormData();
      formdata.append('id', selectedTrashcan.id);
      formdata.append('action', action);
      formdata.append('user_id', user.id);
      console.log(JSON.stringify(formdata));
      var requestOptions = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: formdata,
      };

      const prevLikeState = userLikes;
      const prevDisLikeState = userDisLikes;

      await fetch(`http://${URL}/action/`, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log(result);
          setLikes(result.likes);
          setDisLikes(result.dislikes);
          setUserLikes(result.userLikes);
          setUserDisLikes(result.userDisLikes);
        })
        .catch((error) => console.log('error', error));

        if (action == 'like' && !userLikes) {
          if (prevDisLikeState) disLikeAnimation.current.play(40, 10);
          likeAnimation.current.play(10, 40);
        }
        else if (action == 'like' && userLikes) likeAnimation.current.play(40, 10);
        else if (action == 'dislike' && !userDisLikes) {
          if (prevLikeState) likeAnimation.current.play(40, 10);
          disLikeAnimation.current.play(10, 40);
        }
        else if (action == 'dislike' && userDisLikes) disLikeAnimation.current.play(40, 10);

        console.log('likeanimation', likeAnimation);
        console.log('dislikeanimation', disLikeAnimation);
    }
  };

  if (loading) {
    if (isFirstLoad === false) {
      setTimeout(async () => {
        await reloadPinData();
      }, 3000);
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: '20%'}}>
        <LottieView
          style={{width: 150, height: 150}}
          source={require('../assets/lottie/loading.json')}
          autoPlay
          loop
        />
      </View>
    );
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={{flexDirection: 'row', paddingRight: 50}}>
          <View style={{flexDirection: 'column', alignItems: 'center', marginTop: '13%'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                postActions('like');
              }}>
              <LottieView
                ref={likeAnimation}
                style={{width: 80, height: 80}}
                source={require('../assets/lottie/like.json')}
                autoPlay={false}
                loop={false}
              />
            </TouchableWithoutFeedback>

            <Text style={{color: likeTextColor}}>
                  {likes - dislikes}
            </Text>

            <TouchableWithoutFeedback
              onPress={() => {
                postActions('dislike');
              }}>
              <LottieView
                ref={disLikeAnimation}
                style={{width: 80, height: 80}}
                source={require('../assets/lottie/dislike.json')}
                autoPlay={false}
                loop={false}
              />
            </TouchableWithoutFeedback>
          </View>

          <ImageModal
            style={styles.image}
            resizeMode="contain"
            source={{
              // ${selectedTrashcan.image}가 /media/경로/.jpeg형태이기 때문에 http://${URL}${selectedTrashcan.image}로 수정
              uri: `http://${URL}${selectedTrashcan.image}`,
            }}
          />
        </View>

        <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Text style={{marginTop: '40%'}}>{selectedTrashcan.description}</Text>
          </View>
          <Text style={{marginTop: '25%'}}>게시자 : {selectedTrashcan.author.email}</Text>
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          {user != null &&
            user.email == selectedTrashcan.author.email ? (
            <TouchableHighlight
              style={{...styles.deleteButton}}
              onPress={async () => {
                await deleteData();
                setSelectedIndex(null);
                setSelectedId(null);
                setLoading(true);
                setModalVisible(!modalVisible);
                refreshData();
              }}>
              <Text style={styles.textStyle}> 삭제 </Text>
            </TouchableHighlight>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 3
  },
  image: {
    width: 225,
    height: 225,
    marginTop: 10,
  },
  text: {
    marginTop: 0,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#B30000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    width: Dimensions.get('window').width,
    height: 40,
  },
});
