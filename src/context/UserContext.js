import React, { createContext, useReducer, useContext } from 'react';

import * as api from '../service/Api';
import createAsyncDispatcher from './AsyncActionUtils'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
  user: {
    loading: false,
    data: null,
    error: null,
    success: false
  }
};

// 로딩중일 때 바뀔 상태 객체
const loadingState = {
  loading: true,
  data: null,
  error: null,
  success: false
};

// 성공했을 때의 상태 만들어주는 함수
const success = data => ({
  loading: false,
  data,
  error: null,
  success: true
});

// 실패했을 때의 상태 만들어주는 함수
const error = error => ({
  loading: false,
  data: null,
  error: error
});

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
const userReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USER':
      return {
        ...state,
        user: loadingState
      };
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        user: success(action.data)
      };
    case 'GET_USER_ERROR':
      return {
        ...state,
        user: error(action.error)
      };
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const UserStateContext = createContext(null);
const UserDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
export const useUserState = () => {
  const state = useContext(UserStateContext);
  if (!state) {
    throw new Error('Cannot find UserProvider');
  }
  return state;
}

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
export const useUserDispatch = () => {
  const dispatch = useContext(UserDispatchContext);
  if (!dispatch) {
    throw new Error('Cannot find UserProvider');
  }
  return dispatch;
}

export const getUser = createAsyncDispatcher('GET_USER', api.getUser);

// export const getUser = async (dispatch, token) => {
//   var formdata = new FormData();

//   formdata.append('access_token', token.accessToken);
//   console.log('in fetchGoogleLoginFinish', formdata);
//   var requestOptions = {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     method: 'POST',
//     body: formdata,
//     redirect: 'follow',
//   };

//   await fetch(`http://${URL}/accounts/google/login/finish/`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       dispatch({ 
//         type: 'GET_USER_SUCCESS', 
//         data: {
//           accessToken: result.access_token, 
//           refreshToken: result.refresh_token, 
//           user: result.user
//         } 
//       });
//     })
//     .catch((error) => dispatch({ type: 'GET_USER_ERROR', error: e }));
// }