import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {TouchableHighlight} from '@gorhom/bottom-sheet';
import {UserDetailScreen} from '../scenes/UserDetailScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {getUser} from '../service/UserManager';

import {GoogleSignin, statusCode} from '@react-native-community/google-signin';

import {setGoogleLoginUser} from '../service/UserManager';
import {webClientId} from '../../env.json';
import {googleLogout} from '../service/UserManager';

export const Auth = ({
  authModalVisible,
  setAuthModalVisible,
  selectedIndex,
}) => {
  const [user, setUser] = useState(0);

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
    const checkUser = async () => {
      if (authModalVisible === true) {
        const _user = await getUser();
        console.log('user trashcaninfo', _user);
        setUser(_user);
        if (_user === null) {
          await googleSignIn();
          const _user = await getUser();
          console.log('checkUser aaaa', _user);

          setUser(_user);
        }
      }
    };

    checkUser();
  }, [authModalVisible]);

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
      await setGoogleLoginUser(
        {
          accessToken: tokens.accessToken,
          code: userInfo.serverAuthCode,
          idToken: userInfo.idToken,
        },
        userInfo.user,
      );
    } catch (error) {
      console.log('message____________', error.message);
      if (error.code === statusCode.SIGN_IN_CANCELLED) {
        console.log('USER CANCELLED');
      } else if (error.code === statusCode.IN_PROGRESS) {
        console.log('signin in');
      } else if (error.code === statusCode.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.log('some other error happened');
      }
    }
  };

  return (
    <View style={styles.centeredView}>
      {user ? <UserDetailScreen user={user} /> : null}
      <TouchableHighlight
        style={{...styles.logoutButton}}
        onPress={async () => {
          console.log('logout button clecked!!');
          await googleLogout();
          setAuthModalVisible(false);
        }}>
        <Text style={styles.textStyle}> 로그아웃 </Text>
      </TouchableHighlight>
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B30000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    width: windowWidth,
    height: windowHeight * 0.05,
  },
});
