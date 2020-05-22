import React, {useState, useEffect, useReducer, useCallback} from 'react';
import performance from 'performance-now';
import {View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, TouchableOpacity, TouchableNativeFeedback, Dimensions, Platform, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {AppLoading} from 'expo';
import Colors from '../constants/Colors';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import NumberContainer from '../components/numberContainer';
import {LinearGradient} from 'expo-linear-gradient';
import * as highScoreActions from '../store/actions/highScores';
import PHRASES from '../data/phrases';
import SOUNDS from '../data/listSounds';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import moment from 'moment';
import Player from '../Player';
var now = require("performance-now");

const PlayScreen = props => {
    const [isButton1Pressed, setIsButton1Pressed] = useState(false);
    const [isButton2Pressed, setIsButton2Pressed] = useState(false);
    const [date1, setDate1] = useState();
    const [date2, setDate2] = useState();
    const [timeDiff, setTimeDiff] = useState(null);
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width)
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height)
    const [phrasesIdx, setPhrasesIdx] = useState(0);
    const [soundsIdx, setSoundsIdx] = useState(0);
    const editedProfile = useSelector(state => state.profile.profile);
    const [userName, setUserName] = useState(!editedProfile[0] ? '' : editedProfile[0].userName);
    const allHighScores = useSelector(state => state.highScores.availableHighScores);
    const userId = useSelector(state => state.auth.userId);
    const [firstAlert,setFirstAlert] = useState(true);

    const dispatch = useDispatch();


    useEffect(() => {
        if (userName === '' && firstAlert){
        Alert.alert('No User Name Set', 'Please update user name from main menu to save score', [
            { text: 'Okay' }
          ]);        
        setFirstAlert(false);
        }
    });

    const saveScoreHandler = () => {
        if(userName == ''){
            Alert.alert('No User Name Set', 'Nothing saved, please update user name from main menu', [
                { text: 'Okay' }
              ]);
        } else if (timeDiff === null){
            Alert.alert('No High Score Set', 'Nothing saved, please play the game first', [
                { text: 'Okay' }
              ]);            
        } else {
            const curScore = allHighScores.filter(score => score.ownerId === userId  && score.gameLevel === 'basic')
            const date = moment().format('MMMM Do YYYY, h:mm:ss a');
            if (curScore.length === 0) {
                dispatch(highScoreActions.createHighScore(userName,date,+timeDiff,'basic'));
            } else if (+timeDiff < curScore[0].score) {
                dispatch(highScoreActions.editHighScore(curScore[0].id,userName,date,+timeDiff,'basic'));
            }
            Alert.alert('Saved', 'Taking best score for score board', [
                { text: 'Okay' }
              ]);
        }
    }

    useEffect(() => {
        const updateLayout = () => {
            setContainerWidth(Dimensions.get('window').width);
            setContainerHeight(Dimensions.get('window').height);
        };
        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        };
    });

    useEffect(() => {
        if(isButton1Pressed && isButton2Pressed){
            setIsButton1Pressed(false);
            setIsButton2Pressed(false);
            setTimeDiff(Math.abs(date1 - date2).toFixed(3)/1000.0)
            if(phrasesIdx+2 >= PHRASES.length){
                setPhrasesIdx(0);
            } else {
                setPhrasesIdx(phrasesIdx + 2);
            }
            if(soundsIdx+2 >= SOUNDS.length){
                setSoundsIdx(0);
            } else {
                setSoundsIdx(soundsIdx + 2);
            }
        }
    },[isButton1Pressed, isButton2Pressed])

    useEffect(() => {
        props.navigation.setOptions({
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Save"
                iconName={
                  Platform.OS === 'android' ? 'md-save' : 'ios-save'
                }
                onPress={saveScoreHandler}
              />
            </HeaderButtons>
          )
        });
      }, [saveScoreHandler]);

    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.screen}>
            <View style={{...styles.text, marginTop: containerHeight * 0.05}}>
                <Text>Tap both buttons as quickly as possible!</Text>
            </View>
            <NumberContainer width={containerWidth*0.5}>{timeDiff} sec.</NumberContainer>
            <View style={{...styles.buttonContainer, marginTop: containerHeight * 0.05}}>
                { !isButton1Pressed && <View onTouchStart={() => {
                    //const date = new Date(new Date().getTime()).getTime();
                    setDate1(now());
                    Player.playSound(SOUNDS[soundsIdx])
                    setIsButton1Pressed(true);
                    }}>
                    <MainButton style={{marginLeft: containerWidth*0.02,  width: containerWidth / 3, height: containerHeight / 3}}>
                        {PHRASES[phrasesIdx]}
                    </MainButton>
                </View>
                }
                { !isButton2Pressed && <View style={{position: 'absolute', right: containerWidth*0.1}} onTouchStart={() => {
                    //const dateX = new Date(new Date().getTime()).getTime();
                    setDate2(now());
                    Player.playSound(SOUNDS[soundsIdx+1])
                    setIsButton2Pressed(true);
                    }}>
                    <MainButton style={{width: containerWidth / 3, height: containerHeight / 3}}>
                        {PHRASES[phrasesIdx+1]}
                    </MainButton>
                </View>
                }
            </View>
        </View>
        </LinearGradient>
    );
};

export const screenOptions = {
    headerTitle: "Basic Mode",
    headerStyle: {
        backgroundColor: '#ffedff',
        shadowColor: 'transparent',
    },
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: {
        flex: 1,
    },
    text: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        //height: '10%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '10%',
      },
});



export default PlayScreen;