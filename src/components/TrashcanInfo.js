import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {URL} from '../../env.json';
import {useUserState, useUserDispatch, getUser, UserContext} from '../context/UserContext';
import {usePinState, usePinDispatch, getPin, PinContext} from '../context/PinContext';

export const TrashcanInfo = ({
  modalVisible,
  setModalVisible,
  selectedIndex,
  setSelectedIndex,
  selectedId,
  setSelectedId
}) => {
  const [tmp, setTmp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrashcan, setSelectedTrashcan] = useState();

  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const { user } = userState; // included : data, loading, error, success

  const pinState = usePinState();
  const pinDispatch = usePinDispatch();
  const { pin } = pinState; // included : data, loading, error, success

  useEffect(() => {
    console.log("trashcaninfo")
    const getSelectedTrashcan = async () => {
      var requestOptions = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'GET',
        redirect: 'follow',
      };
      await fetch(
        `http://${URL}/locations/${selectedId}/`,
        requestOptions,
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("getSelectedTrashcan", result);
          setSelectedTrashcan(result);
          setLoading(false) // 로딩 제대로 작동 함.
        })
        .catch((error) => console.log('error', error));
    }

    if(selectedIndex !== null)
      getSelectedTrashcan();
  }, [selectedIndex])

  if(user.success) console.log("user", user.data)


  const refreshData = async () => {
    getPin(pinDispatch)
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

    await fetch(
      `http://${URL}/locations/${selectedId}/`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('log', result);
      })

      .catch((error) => console.log('error', error));
  };

  if(loading) return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
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
  )

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
              <Text>게시자 : {selectedTrashcan.author.email}</Text>
              {user.success && user.data.user.email == selectedTrashcan.author.email ? (
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
                uri: selectedTrashcan.image,
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
});
