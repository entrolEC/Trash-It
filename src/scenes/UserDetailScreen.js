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
});
