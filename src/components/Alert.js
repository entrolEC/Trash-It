import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Image} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import Modal from 'react-native-modal';

export const Alert = ({
  alertVisible,
  setAlertVisible,
  title,
  message,
  callback = null,
}) => {
  return (
    <AwesomeAlert
      show={alertVisible}
      showProgress={false}
      animatedValue={0.5}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={false}
      showConfirmButton={true}
      cancelText=""
      confirmText="알겠어요!"
      confirmButtonColor="#DD6B55"
      onCancelPressed={() => {
        setAlertVisible(false);
      }}
      onConfirmPressed={() => {
        setAlertVisible(false);
        if (callback !== null) callback();
      }}
      setAlertVisible
      contentContainerStyle={styles.alert}
    />
  );
};

const styles = StyleSheet.create({
  alert: {
    width: '70%',
    height: 180,
    overflow: 'hidden',
  },
});
