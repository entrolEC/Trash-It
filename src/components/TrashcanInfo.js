/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {URL} from '../../env.json';
import {
  useUserState,
  useUserDispatch,
  getUser,
  UserContext,
} from '../context/UserContext';
import {
  usePinState,
  usePinDispatch,
  getPin,
  PinContext,
} from '../context/PinContext';

import Modal from 'react-native-modal';

export const TrashcanInfo = ({
  modalVisible,
  setModalVisible,
  selectedIndex,
  setSelectedIndex,
  selectedId,
  setSelectedId,
}) => {
  const [tmp, setTmp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrashcan, setSelectedTrashcan] = useState();

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const {user} = userState; // included : data, loading, error, success

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const {pin} = pinState; // included : data, loading, error, success

  const [likes, setLikes] = useState(0);
  const [dislikes, setDisLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(false);
  const [userDislikes, setUserDisLikes] = useState(false);

  useEffect(() => {
    var formdata = new FormData();
    formdata.append('id', selectedId);
    formdata.append('user_id', 5);

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
      await fetch(`http://${URL}/locations/${selectedId}/?user_id=${user.data.user.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('getSelectedTrashcan', result);
          setSelectedTrashcan(result);
          setLikes(result.likes);
          setDisLikes(result.dislikes);
          setUserLikes(result.userLikes);
          setUserDisLikes(result.userDisLikes);
          setLoading(false); // 로딩 제대로 작동 함.
        })
        .catch((error) => console.log('error', error));
    };

    if (modalVisible === true) getSelectedTrashcan();
  }, [modalVisible]);

  if (user.success) console.log('user', user.data);

  const refreshData = async () => {
    getPin(pinDispatch);
  };

  const deleteData = async () => {
    console.log('selectedIndex.id', selectedTrashcan.id);
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.data.accessToken,
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
    var formdata = new FormData();
    formdata.append('id', selectedTrashcan.id);
    formdata.append('action', action);
    formdata.append('user_id', user.data.user.id);
    console.log(JSON.stringify(formdata));
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    };

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
  };

  if (loading)
    return (
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
          }}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>로딩중입니다.</Text>
            </View>
          </View>
        </Modal>
      </View>
    );

  return (
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
        }}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
              <Text>게시자 : {selectedTrashcan.author.email}</Text>
              {user.success &&
              user.data.user.email == selectedTrashcan.author.email ? (
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
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setLoading(true);
                setModalVisible(!modalVisible);
                setSelectedIndex(null);
                setSelectedId(null);
                // console.log(`this is trashcanLocation`, selectedTrashcan);
                //addNewTrashcan()
              }}>
              <Text style={styles.textStyle}> 확인 </Text>
            </TouchableHighlight>

            {
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
            }

            {
              !userDislikes ? (
                <TouchableHighlight
                  style={{...styles.likes}}
                  onPress={() => {
                    postActions('dislike');
                  }}>
                  <Text style={{...styles.textStyle, color: 'black'}}> 싫어요 {dislikes} </Text>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  style={{...styles.likes, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    postActions('dislike');
                  }}>
                  <Text style={{...styles.textStyle, color: 'white'}}> 싫어요 {dislikes} </Text>
                </TouchableHighlight>
              )
            }

          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
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
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginVertical: 20,
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
    padding: 10,
    marginTop: 15,
    elevation: 2,
  },
});
