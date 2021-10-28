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
import {UserDetailScreen} from '../scenes/UserDetailScreen';

import Modal from 'react-native-modal';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {getNewToken, getUser} from '../service/UserManager';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCode,
} from '@react-native-community/google-signin';

import {setGoogleLoginUser} from '../service/UserManager';
import {getData} from '../service/AsyncStorage';
import {URL, webClientId} from '../../env.json';
import {googleLogout} from '../service/UserManager';

export const Auth = ({
  authModalVisible,
  setAuthModalVisible,
  selectedIndex,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState(0);
  const [userGoogleInfo, setUserGoogleInfo] = useState();
  const [googleLoaded, setGoogleLoaded] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    console.log(webClientId);
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
      webClientId: webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      iosClientId:
        '954273909234-9d9amhh149brmim1gatunqbc14pjjf14.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    if (authModalVisible === true) {
      getUser().then(async (_user) => {
        console.log('user trashcaninfo', _user);
        setUser(_user);
        if (_user === null) await googleSignIn();
      });
    }
  }, [authModalVisible]);

  useEffect(() => {
    if (token !== undefined) {
      console.log('tokens are ready', token);
      setGoogleLoginUser(token, userGoogleInfo.user);
    }
  }, [token]);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log('1');
      const userInfo = await GoogleSignin.signIn();
      console.log('2');
      const tokens = await GoogleSignin.getTokens();
      console.log('3');
      console.log('userInfo : ', userInfo);
      console.log('tokens :', tokens);
      setUserGoogleInfo(userInfo);
      setToken({
        accessToken: tokens.accessToken,
        code: userInfo.serverAuthCode,
        idToken: userInfo.idToken,
      });
      setGoogleLoaded(true);
      console.log('getData', getData('user'));
      setUser(userInfo);
    } catch (error) {
      console.log('message____________', error.message);
      if (error.code === statusCode.SIGN_IN_CANCELLED)
        console.log('USER CANCELLED');
      else if (error.code === statusCode.IN_PROGRESS) console.log('signin in');
      else if (error.code === statusCode.PLAY_SERVICES_NOT_AVAILABLE)
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      else console.log('some other error happened');
    }
  };

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
            {user ? <UserDetailScreen user={user} /> : null}
            <TouchableHighlight 
              style={{...styles.deleteButton}}
              onPress={async () => {
                setAuthModalVisible(false);
                await googleLogout();
              }}
            >
              <Text style={styles.textStyle}> 로그아웃 </Text>
            </TouchableHighlight>
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
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B30000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    width: '100%',
    height: 30,
  },
});
