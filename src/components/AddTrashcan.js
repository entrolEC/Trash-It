import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import PositionContext from '../context/PositionContext'

export const AddTrashcan = ({modalVisible, setModalVisible}) => {

  const { currentPosition, setCurrentPosition } = React.useContext(PositionContext)

  const addNewTrashcan = () => {
    //data.push(currentPosition)

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeExif: true,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      console.log(image);

      var formdata = new FormData();
      formdata.append("latitude", currentPosition.latitude);
      formdata.append("longitude", currentPosition.longitude);
      formdata.append("address", "인천 송도과학로27번길 15");
      formdata.append("image", {uri: image.path, type: "image/jpeg", name: ";alkfsdj;ljkasdf"});

      var requestOptions = {
        headers:{
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch("http://112.145.103.184:8000/locations/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    });
  }

  const getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      console.log(JSON.stringify(position))
      const {longitude, latitude} = position.coords
      await setCurrentPosition({
        latitude: latitude,
        longitude: longitude,
      })
    })
    console.log(currentPosition)
  }

  useEffect(() => {
    console.log("success!!!!!!!!!!!!!!!!!!!")
    //setModalVisible(modalVisible)
  },[])
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>현재 위치에 쓰레기통을 추가합니다.</Text>
            <View style={styles.buttonContainer}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>     취소     </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  addNewTrashcan()
                  getLocation()
                }}
              >
                <Text style={styles.textStyle}>     확인     </Text>
              </TouchableHighlight>
            </View>            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2,
    marginHorizontal: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 30,
    textAlign: "center"
  },
  buttonContainer : {
    flexDirection: "row",
    alignContent: "space-around"
  }
});
