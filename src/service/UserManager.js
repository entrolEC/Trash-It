import jwt_decode from 'jwt-decode';
import { setData, getData, mergeData } from './AsyncStorage';
import { getNewAccessToken, googleLoginFinish } from './Api';

const checkExpired = (accessToken) => {
  const decoded = jwt_decode(accessToken);
  console.log("checkExpired", decoded);
  return decoded.exp < (Date.now() / 1000);
}

export const getUser = async () => {
  const user = await getData('user');
  return user;
}

export const getNewToken = async () => {
  const user = await getUser();
  console.log("getNewToken - user : ", user);
  if(checkExpired(user.accessToken)) {
    console.log("token has expired!!!");
    try {
      const newAccessToken = await getNewAccessToken(user.refreshToken);
      console.log("getNewToken - newAccessToken", newAccessToken);
      await mergeData('user', {accessToken: newAccessToken});
      return newAccessToken;
    } catch (e) {
      console.log("error on getNewAccessToken", e);
    }
    
  } else {
    return user.accessToken;
  }
}

export const setGoogleLoginUser = async (token, userGoogleInfo) => {
  let user = await googleLoginFinish(token);
  const userId = user.user.id;
  user.user = userGoogleInfo;
  user.user.id = userId;
  await setData('user', user);
}