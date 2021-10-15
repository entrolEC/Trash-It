import Geolocation from 'react-native-geolocation-service';

export const getGeolocation = async (dispatch) => {
  dispatch(0)
  await Geolocation.getCurrentPosition(
    (position) => {
      console.log("getGeolocation", position)
      dispatch(position.coords);
    },
    (error) => {console.log(error)},
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
}