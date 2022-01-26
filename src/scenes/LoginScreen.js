import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Button,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCode,
} from '@react-native-community/google-signin';

import {setGoogleLoginUser} from '../service/UserManager';
import {getData} from '../service/AsyncStorage';
import {URL, webClientId} from '../../env.json';

export const LoginScreen = ({
  isRegister,
  setIsRegister,
  setAuthModalVisible,
  user,
  setUser,
}) => {
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
    setUser(getData('user').user);
  }, []);

  useEffect(() => {
    if (token !== undefined) {
      console.log('tokens are ready', token);
      setGoogleLoginUser(token, userGoogleInfo.user);
    } else {
      googleSignIn();
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
    <SafeAreaView>
      <Text>fea</Text>
    </SafeAreaView>
  );
};