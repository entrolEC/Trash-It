import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import PositionContext from '../context/PositionContext'

export const AddTrashcan = ({modalVisible, setModalVisible}) => {
  const { trashcanLocation, setTrashcanLocation } = React.useContext(PositionContext)
  const { currentPosition, setCurrentPosition } = React.useContext(PositionContext)
  const { user, setUser } = React.useContext(PositionContext)
  const [description, setDescription] = useState("설명 없음")
  const [ data, setData ] = useState(0)
  const [image, setImage] = useState()

  const fetchData = async () => {
    console.log("fetchdata!")

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    await fetch("http://121.171.155.192:8080/locations/", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setTrashcanLocation(result)
      })
      .catch(error => console.log('error', error));
  }

   const getLocation = () => {
    Geolocation.getCurrentPosition(position => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }) 
    },
    error => console.log(error),
    { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 })
    console.log("getlocation", currentPosition)
  }

  const addNewTrashcan = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeExif: true,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      console.log(image);
      setImage(image)
      getLocation()
      
    });
  }

  useEffect(() => {
    console.log(currentPosition)
    if(image) {
      let temp = {
        address : "인천 송도과학로27번길 15",
        image : {uri: image.path, type: "image/jpeg", name: ";alkfsdj;ljkasdf"}
      }
      setData(temp)
    }
  },[currentPosition, image])

  const postData = async () => {
    var formdata = new FormData();
    formdata.append("latitude", currentPosition.latitude);
    formdata.append("longitude", currentPosition.longitude);
    formdata.append("address", data.address);
    formdata.append("image", data.image);
    formdata.append("description", description);
    var requestOptions = {
      headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Token ' + user.token
      },
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    await fetch("http://121.171.155.192:8080/locations/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    //setModalVisible(modalVisible)
  },[])
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>현재 위치에 쓰레기통을 추가합니다.</Text>
            <View style={styles.itemsContainer}>
              <View style={{...styles.itemContainer, flexDirection: "row"}}>
                <Text style={styles.itemText}>이미지</Text>
                <TouchableHighlight
                  style={styles.cameraButton}
                  onPress={() => {
                    addNewTrashcan()                    
                  }}
                >
                  <Text style={styles.textStyle}>     촬영     </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>설명</Text>
                <TextInput
                  style={{
                    height: 80,
                    borderColor: '#aaaaaa',
                    borderWidth: 0.5,
                    borderRadius: 10
                  }}
                  onChangeText={text => setDescription(text)}
                  placeholder={"간단한 설명을 부탁드립니다! \n ex) 버스정류장 옆 or ~ 가게 앞"}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible)
                  }}
                >
                  <Text style={styles.textStyle}>     취소     </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={async () => {
                    if(data) {
                      console.log("here")
                      setModalVisible(!modalVisible);
                      await postData()
                      await fetchData()
                      //setTimeout(()=>{ fetchData() }, 1000)
                      setData(0)
                    }                        
                  }}
                >
                  <Text style={styles.textStyle}>     확인     </Text>
                </TouchableHighlight>
              </View>       
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 40,
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
    marginHorizontal: 13,
    width: 100
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 30,
    textAlign: "center",
    fontSize: 20
  },
  itemText: {
    marginBottom: 10,
    textAlign: "left"
  },
  buttonContainer : {
    flexDirection: "row",
    //alignContent: "space-around"
    justifyContent: "space-around"
  },
  itemContainer : {
    marginVertical: 20
  },
  itemsContainer: {
    padding: 10
  },
  cameraButton: {
    backgroundColor: "#41B6FF",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    width: 100,
    marginLeft: 130
  }
});
