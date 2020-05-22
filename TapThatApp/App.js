import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';
import Player from './Player';
import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import highScoreReducer from './store/reducers/highScores';
import profileReducer from './store/reducers/profile';
import soundLibrary from './sounds';

const rootReducer = combineReducers({
  auth: authReducer,
  highScores: highScoreReducer,
  profile: profileReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const loadAssets = () => {
  const sounds = Player.load(soundLibrary)

  return Promise.all([
    Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    }),
    ...sounds
  ])
}

export default function App() {
  const [stateReady, setStateReady] = useState(false);

  if(!stateReady) {
    return <AppLoading startAsync={loadAssets} onFinish={() => {
      setStateReady(true);
    }} onError={console.warn}/>;
  } else {
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  );
  }
}

