import React from 'react';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';

import playScreen, {screenOptions as playScreenOptions}  from '../screens/PlayScreen'; 
import playScreenMoving, {screenOptions as playScreenMovingOptions}  from '../screens/playScreenMoving'; 
import playScreenManyTouch, {screenOptions as playScreenManyTouchOptions}  from '../screens/playManyTapScreen'; 
import mainMenuScreen, {screenOptions as mainScreenOptions} from '../screens/mainMenuScreen';
import filtersScreen, {screenOptions as filterScreenOptions} from '../screens/filtersScreen';
import scoreScreen, {screenOptions as scoreScreenOptions} from '../screens/highScoresScreen';
import editProfileScreen, {screenOptions as editedScreenOptions} from '../screens/editProfileScreen';
import authScreen, {screenOptions as authScreenOptions} from '../screens/Auth';


import Colors from '../constants/Colors';
import {Ionicons} from '@expo/vector-icons';

const defaultNavOptions =  {
    headerStyle: {
        backgroundColor: Colors.primary,
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Colors.primary,
};

const PlayStackNavigator = createStackNavigator();

export const PlayNavigator = () => {
    return (
    <PlayStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <PlayStackNavigator.Screen 
            name="menu"
            component={mainMenuScreen}
            options={mainScreenOptions}
        />
        <PlayStackNavigator.Screen 
            name="play"
            component={playScreen}
            options={playScreenOptions}
        />
        <PlayStackNavigator.Screen 
            name="scoreBoard"
            component={scoreScreen}
            options={scoreScreenOptions}
        />
        <PlayStackNavigator.Screen 
            name="profile"
            component={editProfileScreen}
            options={editedScreenOptions}
        />
        <PlayStackNavigator.Screen 
            name="filters"
            component={filtersScreen}
            options={filterScreenOptions}
        />
        <PlayStackNavigator.Screen 
            name="playMoving"
            component={playScreenMoving}
            options={playScreenMovingOptions}
        />
        <PlayStackNavigator.Screen 
            name="playManyTouch"
            component={playScreenManyTouch}
            options={playScreenManyTouchOptions}
        />
    </PlayStackNavigator.Navigator>
    );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNavigator.Screen 
                name="Auth"
                component={authScreen}
                options={authScreenOptions}
            />
        </AuthStackNavigator.Navigator>
    );
}