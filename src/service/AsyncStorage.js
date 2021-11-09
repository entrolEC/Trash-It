import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value, callbacks = null) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value),
      callbacks
    );
    console.log("setdata complete");
  } catch(err) {
    console.log("setData error", err);
  }
}

export const getData = async (key, callbacks = null) => {
  // tokenId, userId 불러오기
  try {
    let data = await AsyncStorage.getItem(key, callbacks);
    console.log("asyncstorage getdata", data);
    if(data != null) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (err) {
    console.log("getData error", err);
  }
  
  return null;
}

export const mergeData = async (key, value, callbacks = null) => {
  try {
    await AsyncStorage.mergeItem(
      key,
      JSON.stringify(value),
      callbacks
    );
  } catch(err) {
    console.log("mergeData error", err);
  }
}