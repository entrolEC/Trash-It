import { URL } from '../../env.json';

export const getUser = async (token) => {
  let formdata = new FormData();

  formdata.append('access_token', token.accessToken);
  console.log('in fetchGoogleLoginFinish', formdata);
  let requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };
  
  const result = fetch(`http://${URL}/accounts/google/login/finish/`, requestOptions)
  .then((response) => response.json())
  .then((result) => { 
      const data = {
        accessToken: result.access_token, 
        refreshToken: result.refresh_token, 
        user: result.user
      } 
      return data;
  })
  console.log("getUser api method", result);
  return result;
}

export const getPin = async () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const result =  fetch(`http://${URL}/pin/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    console.log("getPin api method", result);
  return result;
}