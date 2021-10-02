import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Dimensions, ActivityIndicator, Button, TextInput, TouchableHighlight } from 'react-native';
import PositionContext from '../context/PositionContext'

export const LoginScreen = ({isRegister, setIsRegister, setAuthModalVisible}) => {

  const { user, setUser } = React.useContext(PositionContext)
  const [inputId, setInputId] = useState();
  const [inputPassword, setInputPassword] = useState();

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

    await fetch("http://192.168.219.106:8000/signin/", requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log(result)
        if (result.Token) {
          await loginSuccess(result)
          setAuthModalVisible(false) 
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
