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
  TouchableHighlight
} from 'react-native';
import PositionContext from '../context/PositionContext'

export const RegisterScreen = ({isRegister, setIsRegister, setAuthModalVisible}) => {

  const { user, setUser } = React.useContext(PositionContext)
  const [inputId, setInputId] = useState();
  const [inputPassword, setInputPassword] = useState();
  const [inputPassword2, setInputPassword2] = useState();
  const [errMessage, setErrMessage] = useState();

  const loginSuccess = (result) => {
    setUser({"token":result.Token, "username": inputId})
  }

  const fetchData = async () => {
    if(inputPassword !== inputPassword2) {
      setErrMessage('비밀번호가 서로 다릅니다!')
    } else if (inputPassword.length < 8) {
      setErrMessage('비밀번호가 너무 짧습니다!')
    } else if (inputId.length > 12 || inputId.length < 4) {
      setErrMessage('아이디가 너무 짧거나 깁니다!')
    } else {
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

      await fetch("http://192.168.219.102:8000/signup/", requestOptions)
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
    
  }

  const onPress = () => {
    setIsRegister(false)
  }

  return(
    <SafeAreaView style={styles.container}>
      {(errMessage) ? (
        <Text style={{color: 'red'}}>{errMessage}</Text>
        ) : (
        <Text>회원가입</Text>
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
       <TextInput
        style={styles.textInput}
        onChangeText={text => setInputPassword2(text)}
        placeholder={"  비밀번호 재입력"}
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.textButton} onPress={onPress}> 이미 계정이 있나요? </Text>
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2176FF" }}
          onPress={() => {
            fetchData()
          }}
        >
          <Text style={styles.textStyle}>회원가입</Text>
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
    textAlign: "center",
    fontSize: 13
  },
});
