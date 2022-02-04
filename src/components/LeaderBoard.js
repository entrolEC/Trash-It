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

import Icon from 'react-native-vector-icons/FontAwesome5';

import {getUsers} from '../service/Api'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const LeaderBoard = ({
  leaderBoardVisible,
  setLeaderBoardVisible,
  loadingVisible,
  setLoadingVisible,
}) => {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [userScore, setUserScore] = useState();
  const [userRank, setUserRank] = useState();
  const crownColor = ['#DAA520', '#C0C0C0', '#A0522D'];

  const fetchData = async () => {
    const result = await getUsers();
    result.sort((a, b) => a.author.length < b.author.length);
    setUsers(result);
  };

  useEffect(() => {
    if (leaderBoardVisible) {
      setLoadingVisible(true);
      fetchData();
      getUser().then((_user) => {
        console.log('user trashcaninfo', _user);
        if (_user !== null) setUser(_user.user);
      });
    }
  }, [leaderBoardVisible]);

  useEffect(() => {
    if (user !== null && users !== null) {
      console.log('user: ', user);
      console.log('users: ', users);
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === user.id) {
          console.log('found!!!!!!!!!!!!!!!!');
          setUserRank(i + 1);
          setUserScore(users[i].author.length);
          setLoadingVisible(false);
          break;
        }
      }
    }
  }, [user, users]);

  const Item = ({username, count, idx}) => (
    <View
      style={
        styles.itemlist
      }>

      {idx < 3 ? (
        <Icon
          name="crown"
          size={20}
          style={{position:'absolute', left:'5%', top:'100%'}}
          color={crownColor[idx]}
        />
      ) : (
        <Text
          style={{...styles.text, position:'absolute', left:'5%', top:'100%', fontWeight: 'bold'}}>
          {idx + 1}
        </Text>
      )}

      <Text style={{...styles.text, position:'absolute', left:'20%', top:'100%'}}>{username}</Text>

      <Text
        style={{
          ...styles.text,
          fontWeight: 'bold',
          color: '#3817aa',
          position:'absolute', right:'10%', top:'100%'
        }}>
        {count}
      </Text>
    </View>
  );

  const renderItem = ({item, index}) => (
    <Item username={item.username} count={item.author.length} idx={index} />
  );

  return (
    <>
      <View style={styles.circle} />
      <View style={styles.centeredView}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              marginTop: '25%',
            }}>
            리더보드
          </Text>
        </View>

        <View
          style={{alignSelf: 'flex-start', paddingLeft: '5%', marginTop: '3%'}}>
          {user !== null ? (
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: user.photo}}
                style={{width: 75, height: 75, borderRadius: 50}}
              />
              <View style={{marginLeft: '15%', paddingTop: 10}}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: 'white'}}>업로드 횟수</Text>
                  <Text
                    style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>
                    {userScore}
                  </Text>
                </View>
              </View>
              <View style={{marginLeft: '20%', paddingTop: 10}}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: 'white'}}>순위</Text>
                  <Text
                    style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>
                    {userRank}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{marginTop: '3%'}}>
          <FlatList
            data={loadingVisible ? null : users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  itemlist: {
    borderColor: '#aaaaaa',
    marginVertical: 5,
    backgroundColor: '#ffffff',
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    width: windowWidth*0.9,
    height: windowHeight*0.1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    marginHorizontal: 5,
  },
  circle: {
    width: windowWidth * 2,
    height: windowWidth * 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '70%',
    borderRadius: windowWidth * 2,
    backgroundColor: '#8CBA80',
  },
});
