import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Modal from 'react-native-modal';

export const Alert = ({
  alertVisible,
  setAlertVisible,
  message,
  callback = null,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationIn="pulse"
        animationInTiming={500}
        animationOut="bounceOutDown"
        animationOutTiming={500}
        transparent={true}
        isVisible={alertVisible}
        backdropColor="none"
        onRequestClose={() => {
          Alert.alert('Modal has been closed');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{message}</Text>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setAlertVisible(!alertVisible);
                if (callback !== null) callback();
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
  },
  text: {
    marginVertical: 20,
  },
});
