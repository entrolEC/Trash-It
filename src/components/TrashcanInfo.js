/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
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

import Modal from 'react-native-modal';
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
  const [tmp, setTmp] = useState([]);
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

  // 처음에는 {user}에게서 가장 가까운 쓰레기통을 bottomsheet로 띄워줌
  // drag up 시 상세정보 표시
  // 다른 핀을 눌렀을 시에는 그 핀에 대한 상세정보를 bottomsheet로 띄움
  useEffect(() => {
    getUser().then((_user) => {
      console.log("user trashcaninfo",_user);
      setUser(_user.user)
      
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

          if (isFirstRun) {
            if (result.userLikes) likeAnimation.current.play(48, 48);
            else likeAnimation.current.play(0, 0);
            if (result.userDisLikes) disLikeAnimation.current.play(50, 50);
            else disLikeAnimation.current.play(0, 0);

            setIsFirstRun(false);
          }
          // if (!isFirstRun) {
          //   if (result.userLikes && !result.userDisLikes) likeAnimation.current.play(10, 40);
          //   if (!result.userLikes && !result.userDisLikes) likeAnimation.current.play(40, 10);
          //   if (result.userDisLikes && !result.userLikes) disLikeAnimation.current.play(10, 40);
          //   if (!result.userDisLikes && !result.userLikes) disLikeAnimation.current.play(40, 10);
          // }
        })
        .catch((error) => console.log('error', error));
      };
      
      if (modalVisible === true) getSelectedTrashcan();
    })
  },[modalVisible, userLikes, userDisLikes]);

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

        // action이 like이고 현재 like상태이면 likeAnimation = 0
        // action이 like이고 현재 like상태가 아니면 likeAnimation = 1
        // action이 like이고 현재 dislike상태이면 likeAnimation = 1 dislikeAnimation = 0
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

  if (loading)
    return (
      <View style={styles.centeredView}>
        <Modal
          animationIn="slideInUp"
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
          }}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>로딩중입니다.</Text>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  setLoading(true);
                  setModalVisible(!modalVisible);
                  setSelectedIndex(null);
                  setSelectedId(null);
                }}>
                <Text style={styles.textStyle}> 취소 </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
            <Text>게시자 : {selectedTrashcan.author.email}</Text>
            {user != null &&
            user.email == selectedTrashcan.author.email ? (
              <TouchableHighlight
                style={{...styles.deleteButton, backgroundColor: '#b30000'}}
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
            ) : (
              <TouchableHighlight
                style={{...styles.deleteButton, backgroundColor: '#aaaaaa'}}>
                <Text style={styles.textStyle}> 삭제 </Text>
              </TouchableHighlight>
            )}
          </View>
          <Image
            style={styles.image}
            source={{
              // ${selectedTrashcan.image}가 /media/경로/.jpeg형태이기 때문에 http://${URL}${selectedTrashcan.image}로 수정
              uri: `http://${URL}${selectedTrashcan.image}`,
            }}
          />
          <Text style={styles.text}>{selectedTrashcan.description}</Text>
          
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* {
              !userLikes ? (
                <TouchableHighlight
                  style={{...styles.likes}}
                  onPress={() => {
                    postActions('like');
                  }}>
                  <Text style={{...styles.textStyle, color: 'black'}}> 좋아요 {likes} </Text>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  style={{...styles.likes, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    postActions('like');
                  }}>
                  <Text style={{...styles.textStyle, color: 'white'}}> 좋아요 {likes} </Text>
                </TouchableHighlight>
              )
            } */}
            <TouchableWithoutFeedback
              underlayColor={"#000000"}
              onPress={() => {
                postActions('like');
              }}>
              <LottieView
                ref={likeAnimation}
                style={{width: 80, height: 80}}
                source={require('../assets/like.json')}
                autoPlay={false}
                loop={false}
              />
            </TouchableWithoutFeedback>
            <Text>
                  {likes}
            </Text>

            <TouchableWithoutFeedback
              underlayColor={"#000000"}
              onPress={() => {
                postActions('dislike');
              }}>
              <LottieView
                ref={disLikeAnimation}
                style={{width: 80, height: 80}}
                source={require('../assets/dislike.json')}
                autoPlay={false}
                loop={false}
              />
            </TouchableWithoutFeedback>
            <Text>
                  {dislikes}
            </Text>
          </View>
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
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 20,
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
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
  },
  text: {
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    marginLeft: 50,
  },
  likes: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#252525',
    borderStyle: 'solid',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});
