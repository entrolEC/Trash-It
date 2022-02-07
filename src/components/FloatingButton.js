import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {usePinDispatch, getPin} from '../context/PinContext';

export const FloatingButton = (props) => {
  const pinDispatch = usePinDispatch();

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [open, setOpen] = useState(0);

  const refreshData = async () => {
    getPin(pinDispatch);
  };

  const userStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -15],
        }),
      },
    ],
  };
  const trashCanStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -30],
        }),
      },
    ],
  };
  const leaderBoardStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -45],
        }),
      },
    ],
  };
  const syncStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
    ],
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {open ? (
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              refreshData();
            }}>
            <Animated.View style={[styles.button, styles.item, syncStyle]}>
              <Icon name="sync-outline" size={20} color="#8B3FBF" />
            </Animated.View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.onPressItem('leaderBoard');
            }}>
            <Animated.View
              style={[styles.button, styles.item, leaderBoardStyle]}>
              <Icon name="trophy-outline" size={20} color="#EB9486" />
            </Animated.View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.onPressItem('addTrashcan');
            }}>
            <Animated.View style={[styles.button, styles.item, trashCanStyle]}>
              <Icon name="trash-outline" size={20} color="#8CBA80" />
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              props.onPressItem('login');
            }}>
            <Animated.View style={[styles.button, styles.item, userStyle]}>
              <Icon name="person-outline" size={20} color="#74B3CE" />
            </Animated.View>
          </TouchableWithoutFeedback>
        </>
      ) : null}

      <TouchableWithoutFeedback
        onPress={() => {
          const toValue = open ? 0 : 1;
          Animated.sequence([
            Animated.spring(animation, {
              toValue,
              friction: 5,
              tension: 50,
              useNativeDriver: true,
            }),
          ]).start();
          setOpen(!open);
        }}>
        <Animated.View style={[styles.button, styles.menu, rotation]}>
          <Icon name="add" size={24} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    right: 30,
    bottom: 30,
  },
  button: {
    // position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {height: 10},
  },
  menu: {
    backgroundColor: '#FF8370',
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#fff',
  },
});
