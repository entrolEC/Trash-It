import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = (key, value) => {
  // tokenId, userId 저장
  AsyncStorage.setItem(
    'userToken',
    JSON.stringify({
      accessToken: value.accessToken,
      refreshToken: value.refreshToken
    })
  );
}

export const getData = async (key) => {
  // tokenId, userId 불러오기
  const userToken = await AsyncStorage.getItem('userData');
  return userToken;
}
