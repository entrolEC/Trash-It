import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Dimensions, ActivityIndicator, Button, TextInput, TouchableHighlight } from 'react-native';
import PositionContext from '../context/PositionContext'
import { GoogleSignin, GoogleSigninButton, statusCode } from '@react-native-community/google-signin';

export const LoginScreen = ({isRegister, setIsRegister, setAuthModalVisible}) => {

  const { user, setUser } = React.useContext(PositionContext)
  const [inputId, setInputId] = useState();
  const [inputPassword, setInputPassword] = useState();
  const [errMessage, setErrMessage] = useState();
  const [userGoogleInfo, setUserGoogleInfo] = useState();
  // const [googleLoaded, setGoogleLoaded] = useState();

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     //scopes: [ 'https://www.googleapis.com/auth/drive.photos.readonly'],
  //     webClientId : '954273909234-951gfeqkhisec5ag6tdrfs73k2a352d0.apps.googleusercontent.com',
  //     offlineAccess : true,
  //     forceCodeForRefreshToken: true
  //   })
  // },[])

  // useEffect(() => {
  //   console.log(userGoogleInfo)
  // },[googleLoaded])

  // const googleSignIn = async () => {
  //   try{
  //     await GoogleSignin.hasPlayServices()
  //     console.log("1")
  //     const userInfo = await GoogleSignin.signIn()
  //     console.log("2")
  //     setUserGoogleInfo(userInfo)
  //     setGoogleLoaded(true)
  //   } catch (error) {
  //     console.log("message____________", error.message)
  //     if (error.code === statusCode.SIGN_IN_CANCELLED)
  //       console.log('USER CANCELLED')
  //     else if (error.code === statusCode.IN_PROGRESS)
  //       console.log("signin in")
  //     else if (error.code === statusCode.PLAY_SERVICES_NOT_AVAILABLE)
  //       console.log("PLAY_SERVICES_NOT_AVAILABLE")
  //     else 
  //       console.log("some other error happened")
  //   }

  
  // }

  const loginSuccess = (result) => {
    setUser({"token":result.Token, "username": inputId})
  }
  
  const fetchData = async () => {
    var formdata = new FormData();
    formdata.append("username", inputId);
    formdata.append("password", inputPassword);

    var requestOptions = {
      headers:{
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    await fetch("http://121.171.155.192:8080/signin/", requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log(result)
        if (result.Token) {
          await loginSuccess(result)
          setAuthModalVisible(false) 
        } else if (result.error) {
          setErrMessage("아이디나 비밀번호가 일치하지 않습니다.")
          console.log("adsflkajs;dlfkja;sdlkfj")
        }       
      })
      .catch(error => console.log('error', error));
  }

  const onPress = () => {
    setIsRegister(true)
  }

  return(
    <SafeAreaView style={styles.container}>
      <Text>로그인된 계정 : {user.username}</Text>
      {(errMessage) && (
        <Text style={{color: 'red'}}>{errMessage}</Text>
      )}
      <TextInput
        style={styles.textInput}
        onChangeText={text => setInputId(text)}
        placeholder={"  아이디"}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={text => setInputPassword(text)}
        placeholder={"  비밀번호"}
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.textButton} onPress={onPress}> 회원이 아니신가요? </Text>
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2176FF" }}
          onPress={fetchData}
        >
          <Text style={styles.textStyle}>로그인</Text>
        </TouchableHighlight>
      </View>
      {/* <GoogleSigninButton
        onPress={googleSignIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        sytle={{width:100, height:100}}
      />   */}
    </SafeAreaView>
  )
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
    borderRadius: 10
  },
  textButton: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#aaaaaa'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 70,
    marginRight: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
