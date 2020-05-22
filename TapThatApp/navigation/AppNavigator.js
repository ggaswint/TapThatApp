import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {PlayNavigator, AuthNavigator} from './mainNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const didTryAutoLogin = useSelector(state => !!state.auth.didTryAutoLogin);
    const isGuest = useSelector(state => !!state.auth.isGuest);

    return (
        <NavigationContainer>
            {(isAuth  || isGuest) && <PlayNavigator/>}
            {!isAuth && !isGuest && didTryAutoLogin && <AuthNavigator />}
            {!isAuth && !isGuest && !didTryAutoLogin && <StartupScreen />}
        </NavigationContainer>
    );
};

export default AppNavigator;