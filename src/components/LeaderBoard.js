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
  const crwonColor = ['#DAA520', '#C0C0C0', '#A0522D'];

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


        console.log('result : ', result);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (leaderBoardVisible) {
      setLoadingVisible(true);
      fetchData();
      getUser().then((_user) => {
        console.log('user trashcaninfo', _user);
        if(_user!==null)
          setUser(_user.user);
      });
    }
  }, [leaderBoardVisible]);
  
  useEffect(() => {
    if(user!==null && users!==null) {
      console.log("user: ",user);
      console.log("users: ",users);
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === user.id) {
          console.log("found!!!!!!!!!!!!!!!!");
          setUserRank(i + 1);
          setUserScore(users[i].author.length);
          setLoadingVisible(false);
          break;
        }
      }
    }
  },[user, users])

  const Item = ({username, count, idx}) => (
    <View
      style={
        idx === 0 ? (
          {...styles.itemlist, paddingVertical: 35}
        ) : styles.itemlist
      }>
      <View style={{flexDirection: 'row'}}>
        {
          idx < 3 ? (
            <Icon name="crown" size={20} style={{...styles.text, marginRight: '20%', fontSize: 20}} color={crwonColor[idx]} />
          ) : (
            <Text style={{...styles.text, marginRight: '20%', fontWeight: 'bold'}}>{idx + 1}</Text>
          )
        }
        
        <Text style={styles.text}>{username}</Text>
       
      </View>
      <Text style={{...styles.text, fontWeight: 'bold', color: '#3817aa', marginLeft: '40%'}}>{count}</Text>
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: '25%' }}>LeaderBoard</Text>
        </View>

        <View style={{alignSelf: 'flex-start', paddingLeft: '5%', marginTop: '3%'}}>
          {
            user!==null ? (
              <View style={{flexDirection: 'row'}}>
                <Image 
                  source={{uri: user.photo}}
                  style={{width: 75, height: 75, borderRadius: 50}}
                />
                <View style={{marginLeft: '15%', paddingTop: 10}}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>업로드 횟수</Text>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>{userScore}</Text>
                  </View>
                </View>
                <View style={{marginLeft: '20%', paddingTop: 10}}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>순위</Text>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>{userRank}</Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        </View>

        <View style={{ marginTop: '3%' }}>
          <FlatList
            data={loadingVisible ? null : users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} />
        </View>
      </View>
      <View />
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  itemlist: {
    borderColor: '#aaaaaa',
    marginVertical: 5,
    backgroundColor: '#ffffff',
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    
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
  }
});
