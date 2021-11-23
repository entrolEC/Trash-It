import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Image} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import Modal from 'react-native-modal';

export const Alert = ({
  alertVisible,
  setAlertVisible,
  title,
  message,
  showCancel=false,
  confirmText,
  cancelText="",
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
      showCancelButton={showCancel}
      showConfirmButton={true}
      cancelText="취소"
      confirmText={confirmText}
      confirmButtonColor="#DD6B55"
      onCancelPressed={() => {
        setAlertVisible(false);
      }}
      onConfirmPressed={() => {
        setAlertVisible(false);
        if (callback !== null) callback();
      }}
      setAlertVisible
      contentContainerStyle={styles.contentContainer}
      contentStyle={styles.contentStyle}
      titleStyle={styles.title}
      messageStyle={styles.message}
      actionContainerStyle={styles.actionContainer}
      confirmButtonStyle={styles.confrimButton}
      confirmButtonTextStyle={styles.confirmButtonText}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: '70%',
    height: '22%',
    padding: '-10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
