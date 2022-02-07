import React, {createContext, useReducer, useContext} from 'react';

import * as api from '../service/Api';
import createAsyncDispatcher from './AsyncActionUtils';

// PinsContext 에서 사용 할 기본 상태
const initialState = {
  pin: {
    loading: false,
    data: null,
    error: null,
    success: false,
  },
};

// 로딩중일 때 바뀔 상태 객체
const loadingState = {
  loading: true,
  data: null,
  error: null,
  success: false,
};

// 성공했을 때의 상태 만들어주는 함수
const success = (data) => ({
  loading: false,
  data,
  error: null,
  success: true,
});

// 실패했을 때의 상태 만들어주는 함수
const error = (error) => ({
  loading: false,
  data: null,
  error: error,
});

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
const pinReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PIN':
      return {
        ...state,
        pin: loadingState,
      };
    case 'GET_PIN_SUCCESS':
      return {
        ...state,
        pin: success(action.data),
      };
    case 'GET_PIN_ERROR':
      return {
        ...state,
        pin: error(action.error),
      };
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
};

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const PinStateContext = createContext(null);
const PinDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
export const PinProvider = ({children}) => {
  const [state, dispatch] = useReducer(pinReducer, initialState);
  return (
    <PinStateContext.Provider value={state}>
      <PinDispatchContext.Provider value={dispatch}>
        {children}
      </PinDispatchContext.Provider>
    </PinStateContext.Provider>
  );
};

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
export const usePinState = () => {
  const state = useContext(PinStateContext);
  if (!state) {
    throw new Error('Cannot find PinProvider');
  }
  return state;
};

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
export const usePinDispatch = () => {
  const dispatch = useContext(PinDispatchContext);
  if (!dispatch) {
    throw new Error('Cannot find PinProvider');
  }
  return dispatch;
};

export const getPin = createAsyncDispatcher('GET_PIN', api.getPin);
