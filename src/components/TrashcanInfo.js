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
import PositionContext from '../context/PositionContext';

import {URL} from '../../env.json';

export const TrashcanInfo = ({
  modalVisible,
  setModalVisible,
  selectedIndex,
  setSelectedIndex,
}) => {
  const {trashcanLocation, setTrashcanLocation} = React.useContext(
    PositionContext,
  );
  const {selectedtrashcan, setSelectedtrashcan} = React.useContext(
    PositionContext,
  );

  const {user, setUser} = React.useContext(PositionContext);
  const [tmp, setTmp] = useState([]);

  const refreshData = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(`http://${URL}/pin/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('refreshData', result);
        setTrashcanLocation(result);
      })
      .catch((error) => console.log('error', error));
  };

  const deleteData = async () => {
    console.log('selectedIndex.id', selectedtrashcan.id);
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.accessToken,
      },
      method: 'DELETE',
      redirect: 'follow',
    };

    await fetch(
      `http://${URL}/locations/${selectedtrashcan.id}/`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('log', result);
      })

      .catch((error) => console.log('error', error));
  };

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
              <Text>게시자 : {selectedtrashcan.author.email}</Text>
              {user._user !== undefined && user._user.email == selectedtrashcan.author.email ? (
                <TouchableHighlight
                  style={{...styles.deleteButton, backgroundColor: '#b30000'}}
                  onPress={async () => {
                    setSelectedIndex(null);
                    await setModalVisible(!modalVisible);
                    await deleteData();
                    await refreshData();
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
                uri: selectedtrashcan.image,
              }}
            />
            <Text style={styles.text}>{selectedtrashcan.description}</Text>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setModalVisible(!modalVisible);
                // console.log(`this is trashcanLocation`, selectedtrashcan);
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
