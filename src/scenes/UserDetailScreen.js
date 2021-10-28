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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    marginVertical: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  textButton: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#aaaaaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 70,
    marginRight: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleloginbtn: {
    width: '100%',
    height: 48,
    marginTop: '10%',
    marginRight: 100,
  },
});
