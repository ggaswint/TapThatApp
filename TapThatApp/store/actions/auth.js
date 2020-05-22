import {AsyncStorage} from 'react-native';
import { exp } from 'react-native-reanimated';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const GUEST = 'GUEST';


let timer;

export const setDidTryAl = () => {
    return {type: SET_DID_TRY_AL};
}

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
    };
};


export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyApYR-pmbBA7SRBapwLJF2a-C2F7SXBt6c',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong ' + errorId
        if (errorId === 'EMAIL_EXISTS') {
            message = 'This email exists already'
        }
        throw new Error(message);
      }

    const resData = await response.json();
    dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn)*1000));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};


export const login = (email, password) => {
    return async dispatch => {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyApYR-pmbBA7SRBapwLJF2a-C2F7SXBt6c',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          })
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong ' + errorId
        if (errorId === 'EMAIL_NOT_FOUND') {
            message = 'This email could not be found'
        }
        else if (errorId === 'INVALID_PASSWORD') {
            message = 'WRONG PASSWORD'
        }
        throw new Error(message);
      }
  
      const resData = await response.json();
      dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn)*1000));
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000);
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};



export const guest = () => {
    return {type: GUEST};
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    };
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }));
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {type: LOGOUT};
};