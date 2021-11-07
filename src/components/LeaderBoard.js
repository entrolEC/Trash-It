/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Modal from 'react-native-modal';
import {getNewToken, getUser} from '../service/UserManager';
import {URL} from '../../env.json';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const LeaderBoard = ({
  leaderBoardVisible,
  setLeaderBoardVisible,
  loadingVisible,
  setLoadingVisible,
}) => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(`http://${URL}/users/`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log('leaderBoard!!', result);
        await result.sort((a, b) => a.author.length < b.author.length);
        setUsers(result);
        setLoadingVisible(false);
        console.log('result : ', result);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (leaderBoardVisible) {
      fetchData();
      setLoadingVisible(true);
    }
  }, [leaderBoardVisible]);

  const renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
      }}
    />
  );

  const Item = ({username, count, idx}) => (
    <View
      style={
        idx % 2 == 0
          ? {...styles.item, backgroundColor: '#f5f5f5'}
          : styles.item
      }>
      <View style={{flexDirection: 'row'}}>
        <Text style={{...styles.username, fontWeight: 'bold'}}>{idx + 1}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.username}>{count}</Text>
    </View>
  );

  const renderItem = ({item, index}) => (
    <Item username={item.username} count={item.author.length} idx={index} />
  );

  return (
    <View style={styles.centeredView}>
      <Modal
        animationIn="pulse"
        animationInTiming={500}
        animationOut="bounceOutDown"
        animationOutTiming={500}
        transparent={true}
        isVisible={leaderBoardVisible}
        backdropColor="none"
        onBackButtonPress={() => {
          setLeaderBoardVisible(!leaderBoardVisible);
        }}
        onBackdropPress={() => {
          setLeaderBoardVisible(!leaderBoardVisible);
          setLoadingVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              ...styles.modalView,
              width: windowWidth * 0.85,
              height: windowHeight * 0.6,
            }}>
            <FlatList
              data={loadingVisible ? null : users}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={renderSeparator}
            />

            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setLoadingVisible(false);
                console.log('touched!');
                setLeaderBoardVisible(!leaderBoardVisible);
              }}>
              <Text style={styles.textStyle}> 확인 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2,
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
  image: {
    width: 300,
    height: 300,
  },
  text: {
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 15,
    marginHorizontal: 5,
  },
});
