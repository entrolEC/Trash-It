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
    // getUserUploadedData();
    console.log(user);
  }, []);

  const getUserUploadedData = async () => {
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'GET',
      redirect: 'follow',
    };
    // params에 user.id를 넘겨줘서 이미 좋아요가 되있는지 확인(userLikes, userDisLikes)
    const params = user.user.id;
    await fetch(
      `http://${URL}/accounts/detail/?user_id=${params}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('getUserData', result);
      })
      .catch((error) => console.log('error'));
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <View style={styles.profile}>
        <Image
          source={{
            uri: user.user.photo,
          }}
          style={styles.image}
        />
        <View style={styles.profiletext}>
          <Text style={styles.username}>{user.user.name}</Text>
          <Text style={styles.email}>{user.user.email}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text>지금까지 총 {22}개의 쓰레기통의 사진을 올리셨습니다.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profiletext: {
    marginLeft: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 25,
  },
  email: {
    marginTop: 10,
  },
  content: {
    marginTop: 20,
  },
});
