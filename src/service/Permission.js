import {PermissionsAndroid} from 'react-native';

export default getLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'TrashIt 위치 권한 요청',
        message: '사용자의 위치 권한이 필요합니다.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      //setHasLocationPermission(true);
    } else {
      console.log('location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};