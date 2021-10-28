import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
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

export const UserDetailScreen = ({user}) => {
  const [errMessage, setErrMessage] = useState();

  useEffect(() => {
    console.log(user.user.photo);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: user.user.photo,
        }}
        style={{width: 200, height: 200}}
      />
      <Text>{user.email}</Text>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <TouchableHighlight style={{...styles.deleteButton}}>
          <Text style={styles.textStyle}> 로그아웃 </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 0,
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
