/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import {URL} from '../../env.json';

import {
  usePinState,
  usePinDispatch,
  getPin,
} from '../context/PinContext';

import ImageModal from 'react-native-image-modal';
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';

import LottieView from 'lottie-react-native';
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
  loadingVisible,
  setLoadingVisible,
  bottomSheetModalRef,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedTrashcan, setSelectedTrashcan] = useState();
  const [user, setUser] = useState(null);

  const pinDispatch = usePinDispatch();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDisLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(false);
  const [userDisLikes, setUserDisLikes] = useState(false);

  const likeAnimation = useRef(null);
  const disLikeAnimation = useRef(null);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [likeTextColor, setLikeTextColor] = useState('#000000');


  const getSelectedTrashcan = async () => {
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'GET',
      redirect: 'follow',
    };
    // params에 user.id를 넘겨줘서 이미 좋아요가 되있는지 확인(userLikes, userDisLikes)
    const params = (user != null ? user.user.id : -1);
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

      if (userLikes) {setLikeTextColor('#00ADB5');}
      else if (userDisLikes) {setLikeTextColor('#F05945');}
      else if (!userLikes && !userDisLikes) {setLikeTextColor('#000000');}

      if (isFirstRun) {
        if (result.userLikes) {likeAnimation.current.play(48, 48);}
        else {likeAnimation.current.play(0, 0);}
        if (result.userDisLikes) {disLikeAnimation.current.play(50, 50);}
        else {disLikeAnimation.current.play(0, 0);}

        setIsFirstRun(false);
      }
    })
    .catch((error) => console.log('error', error, isFirstLoad));
    setIsFirstLoad(false);
  };

  // 처음에는 {user}에게서 가장 가까운 쓰레기통을 bottomsheet로 띄워줌
  // drag up 시 상세정보 표시
  // 다른 핀을 눌렀을 시에는 그 핀에 대한 상세정보를 bottomsheet로 띄움
  useEffect(() => {
    getUser().then(async (_user) => {
      if (_user && !user) {
        console.log('user trashcaninfo',_user);
        setUser(_user.user);
        console.log('setUser fin');
      }
    });
    if (modalVisible === true) {getSelectedTrashcan();}
  },[modalVisible, userLikes, userDisLikes]);

  const refreshData = async () => {
    getPin(pinDispatch);
  };

  const deleteData = async () => {
    console.log('selectedIndex.id', selectedTrashcan.id);
    setLoadingVisible(true);
    setLoading(true);

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
      .then((response) => {
        setLoadingVisible(false);
        setLoading(false);
        setModalVisible(false);
        refreshData();
      })
      .then((result) => {
        console.log('log', result);
        bottomSheetModalRef.dismiss();
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

        if (action === 'like' && !userLikes) {
          if (prevDisLikeState) {disLikeAnimation.current.play(40, 10);}
          likeAnimation.current.play(10, 40);
        }
        else if (action === 'like' && userLikes) {likeAnimation.current.play(40, 10);}
        else if (action === 'dislike' && !userDisLikes) {
          if (prevLikeState) {likeAnimation.current.play(40, 10);}
          disLikeAnimation.current.play(10, 40);
        }
        else if (action === 'dislike' && userDisLikes) {disLikeAnimation.current.play(40, 10);}

        console.log('likeanimation', likeAnimation);
        console.log('dislikeanimation', disLikeAnimation);
    }
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      {(loading) ? (
        <LottieView
          style={{width: 150, height: 150}}
          source={require('../assets/lottie/loading.json')}
          autoPlay
          loop
        />
      ) : (
          <>
          <View style={{ flex: 2, flexDirection: 'row', paddingRight: '17%' }}>
            <View style={{ alignItems: 'center', paddingTop: '5%' }}>
              <TouchableWithoutFeedback
                onPress={async () => {
                  await postActions('like');
                  refreshData();
                } }>
                <LottieView
                  ref={likeAnimation}
                  style={{ height: Dimensions.get('window').width * 0.2 }}
                  source={require('../assets/lottie/like.json')}
                  autoPlay={false}
                  loop={false} />
              </TouchableWithoutFeedback>

              <Text style={{ color: likeTextColor, fontSize: Dimensions.get('screen').height * 0.02 }}>
                {likes - dislikes}
              </Text>

              <TouchableWithoutFeedback
                onPress={async () => {
                  await postActions('dislike');
                  refreshData();
                } }>
                <LottieView
                  ref={disLikeAnimation}
                  style={{ height: Dimensions.get('screen').width * 0.2 }}
                  source={require('../assets/lottie/dislike.json')}
                  autoPlay={false}
                  loop={false} />
              </TouchableWithoutFeedback>
            </View>

            <ImageModal
              style={{ width: Dimensions.get('screen').width * 0.5, height: Dimensions.get('screen').height * 0.25 }}
              resizeMode="contain"
              source={{
                // ${selectedTrashcan.image}가 /media/경로/.jpeg형태이기 때문에 http://${URL}${selectedTrashcan.image}로 수정
                uri: `http://${URL}${selectedTrashcan.image}`,
              }} />
          </View><View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-start', marginTop: Dimensions.get('screen').height * 0.02 }}>
              <Text style={{ fontSize: Dimensions.get('screen').height * 0.02 }}>{selectedTrashcan.description}</Text>
              <Text style={{ fontSize: Dimensions.get('screen').height * 0.02, marginTop: 10 }}>게시자: {selectedTrashcan.author.username}</Text>
            </View><View style={{ flex: 1, justifyContent: 'flex-end' }}>
              {user != null &&
                user.email == selectedTrashcan.author.email ? (
                <TouchableHighlight
                  style={{ ...styles.deleteButton }}
                  onPress={async () => {
                    await deleteData();
                  } }>
                  <Text style={styles.textStyle}> 삭제 </Text>
                </TouchableHighlight>
              ) : null}
            </View>
            </>
      )}
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B30000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    width: Dimensions.get('window').width,
    height: 40,
  },
});
