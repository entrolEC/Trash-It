import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthNavigator} from '../navigation/AuthNavigator';
import {LoginScreen} from '../scenes/LoginScreen';
import {RegisterScreen} from '../scenes/RegisterScreen';

import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Auth = ({
  authModalVisible,
  setAuthModalVisible,
  selectedIndex,
}) => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationIn="pulse"
        animationInTiming={500}
        animationOut="bounceOutDown"
        animationOutTiming={500}
        transparent={true}
        isVisible={authModalVisible}
        backdropColor="none"
        onBackButtonPress={() => {
          setAuthModalVisible(!authModalVisible);
        }}
        onBackdropPress={() => {
          setAuthModalVisible(!authModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              ...styles.modalView,
              width: windowWidth * 0.85,
              height: windowHeight * 0.6,
            }}>
            {isRegister ? (
              <RegisterScreen
                isResister={isRegister}
                setIsRegister={setIsRegister}
                setAuthModalVisible={setAuthModalVisible}
              />
            ) : (
              <LoginScreen
                isResister={isRegister}
                setIsRegister={setIsRegister}
                setAuthModalVisible={setAuthModalVisible}
              />
            )}
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setAuthModalVisible(!authModalVisible);
              }}>
              <Text style={styles.textStyle}> 닫기 </Text>
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
  text: {
    marginVertical: 20,
  },
});
