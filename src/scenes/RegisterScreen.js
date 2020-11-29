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

export const RegisterScreen = ({isRegister, setIsRegister}) => {

  const [inputId, setInputId] = useState();
  const [inputPassword, setInputPassword] = useState();
  const [inputPassword2, setInputPassword2] = useState();

  const onPress = () => {
    setIsRegister(false)
  }

  return(
    <SafeAreaView style={styles.container}>
      <Text>registerScreen</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={text => setInputId(text)}
        placeholder={"  아이디"}
        value={inputId}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={text => setInputId(text)}
        placeholder={"  비밀번호"}
        value={inputPassword}
      />
       <TextInput
        style={styles.textInput}
        onChangeText={text => setInputId(text)}
        placeholder={"  비밀번호 재입력"}
        value={inputPassword2}
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.textButton} onPress={onPress}> 이미 계정이 있나요? </Text>
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2176FF" }}
          onPress={() => {
            setAuthModalVisible(!authModalVisible);
            console.log(trashcanLocation)
            //addNewTrashcan()
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
    textAlign: "center"
  },
});
