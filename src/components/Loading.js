/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

export const Loading = ({loadingVisible, setLoadingVisible}) => {
  return (
    <View>
      <Modal
        animationIn="fadeIn"
        animationInTiming={1}
        animationOut="fadeOut"
        animationOutTiming={1}
        transparent={true}
        isVisible={loadingVisible}
        hasBackdrop={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          style={{width: 150, height: 150}}
          source={require('../assets/lottie/loading.json')}
          autoPlay
          loop
        />
      </Modal>
    </View>
  );
};
