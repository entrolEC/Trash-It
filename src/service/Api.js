import {URL} from '../../env.json';

export const getNewAccessToken = async (refreshToken) => {
  let formdata = new FormData();

  formdata.append('refresh', refreshToken);
  let requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };
  const result = fetch(`http://${URL}/accounts/token/refresh/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result.access;
    });
  console.log('getNewAccessToken', result);
  return result;
};

export const googleLoginFinish = async (token) => {
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

  const result = fetch(
    `http://${URL}/accounts/google/login/finish/`,
    requestOptions,
  )
    .then((response) => response.json())
    .then(async (result) => {
      const data = {
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: result.user,
      };
      console.log('getUser', data);
      return data;
    });
  console.log('getUser api method', result);
  return result;
};

export const getPin = async () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const result = fetch(`http://${URL}/pin/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
  console.log('getPin api method', result);
  return result;
};

export const getUserDetail = (params) => {
  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'GET',
    redirect: 'follow',
  };
  const result = fetch(`http://${URL}/users/${params}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log('error on userdetail ', error, params));

  return result;
};

export const getUsers = () => {
  var requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'GET',
    redirect: 'follow',
  };

  const result = fetch(`http://${URL}/users/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.sort((a, b) => a.author.length < b.author.length);
      return result;
    })
    .catch((error) => console.log('error', error));

  return result;
};

export const checkTrashcan = (formdata, accessToken) => {
  var requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + accessToken,
    },
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  const result = fetch(`http://${URL}/check/`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log('isTrashCanResult', result);
      return result;
    })
    .catch((error) => {
      console.log('isTrashCanError', error);
    });

  return result;
};

export const addTrashcan = (formdata, accessToken) => {
  var requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + accessToken,
    },
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  const result = fetch(`http://${URL}/locations/`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return true;
    })
    .catch((error) => console.log('error', error));

  return result;
};
