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
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
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
        setLoadingVisible(false);

        console.log('result : ', result);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (leaderBoardVisible) {
      fetchData().then(() => {
        getUser().then((_user) => {
          console.log('user trashcaninfo', _user);
          setUser(_user.user);
  
          for (var i = 0; i < users.length; i++) {
            if (users[i]._id === _user.user._id) {
              setUserRank(i + 1);
              setUserScore(users[i].author.length);
              break;
            }
          }
        });
      });
      

      setLoadingVisible(true);
    }
  }, [leaderBoardVisible]);

  const Item = ({username, count, idx}) => (
    <View
      style={
        idx === 0 ? (
          {...styles.itemlist, paddingVertical: 35}
        ) : styles.itemlist
      }>
      <View style={{flexDirection: 'row'}}>
        <Text style={{...styles.text, marginRight: '20%', fontWeight: 'bold'}}>{idx + 1}</Text>
        
        <Text style={styles.text}>{username}</Text>
        {
          idx < 3 ? (
            <Icon name="crown" size={20} style={{marginLeft: 10}} color={crwonColor[idx]} />
          ) : null
        }
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
            user ? (
              <View style={{flexDirection: 'row'}}>
                <Image 
                  source={{uri: user.photo}}
                  style={{width: 75, height: 75, borderRadius: 50}}
                />
                <View style={{marginLeft: '20%', paddingTop: 10}}>
                  <Text style={{color: 'white'}}>COUNT</Text>
                  <Text style={{color: 'white'}}>{userScore}</Text>
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
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    
    elevation: 3,
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
    backgroundColor: '#3817AA',
  }
});
