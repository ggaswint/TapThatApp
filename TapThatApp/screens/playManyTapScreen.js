import React, {useState, useEffect, useReducer, useCallback} from 'react';
import performance from 'performance-now';
import {View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, TouchableOpacity, TouchableNativeFeedback, Dimensions, Platform, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
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
import Player from '../Player';
import moment from 'moment';
var now = require("performance-now");

const PlayScreenMoving = props => {
    const timeInterval = props.route.params.timeInterval;
    const level = props.route.params.level;
    const [isButton1Pressed, setIsButton1Pressed] = useState(false);
    const [date1, setDate1] = useState();
    const [timeDiff, setTimeDiff] = useState(null);
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width)
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height)
    const [phrasesIdx, setPhrasesIdx] = useState(0);
    const [soundsIdx, setSoundsIdx] = useState(0);
    const [numPresses, setNumPresses] = useState(0);
    const editedProfile = useSelector(state => state.profile.profile);
    const [userName, setUserName] = useState(!editedProfile[0] ? '' : editedProfile[0].userName);
    const allHighScores = useSelector(state => state.highScores.availableHighScores);
    const userId = useSelector(state => state.auth.userId);
    const [firstAlert,setFirstAlert] = useState(true);
    const [buttonWidth, setButtonWidth] = useState(125);
    const [buttonHeight, setButtonHeight] = useState(270.66);
    const [button1PositionX, setButton1PositionX] = useState(Math.floor(Math.random()*(containerWidth / 4)))
    const [button1PositionY, setButton1PositionY] = useState(Math.floor(Math.random()*(containerHeight - buttonHeight)))

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
            //dispatch(highScoreActions.createHighScore('MakerGeoff','Jan1971',+timeDiff,'basic'));
        } else if (timeDiff === null){
            Alert.alert('No High Score Set', 'Nothing saved, please play the game first', [
                { text: 'Okay' }
              ]);            
        } else {
            const curScore = allHighScores.filter(score => score.ownerId === userId  && score.gameLevel === level)
            const date = moment().format('MMMM Do YYYY, h:mm:ss a');
            if (curScore.length === 0) {
                dispatch(highScoreActions.createHighScore(userName,date,+timeDiff,level));
            } else if (+timeDiff < curScore[0].score) {
                dispatch(highScoreActions.editHighScore(curScore[0].id,userName,date,+timeDiff,level));
            }
            Alert.alert('Saved', 'Taking best score for score board', [
                { text: 'Okay' }
              ]);
        }
    }

    const getRandomWidth = () => {
        return Math.floor(Math.random()*(Dimensions.get('window').width - buttonWidth))
    }

    const getRandomHeight = () => {
        if (Dimensions.get('window').height  < Dimensions.get('window').width){
            return Math.floor(Math.random()*(Dimensions.get('window').height*0.5) + Dimensions.get('window').height*0.12)
        }
        return Math.floor(Math.random()*(Dimensions.get('window').height - buttonHeight))
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
        if(isButton1Pressed){
            setButton1PositionX(getRandomWidth());
            setButton1PositionY(getRandomHeight());
            if(phrasesIdx+1 == PHRASES.length){
                setPhrasesIdx(0);
            } else {
                setPhrasesIdx(phrasesIdx + 1);
            }
            if(soundsIdx+1 == SOUNDS.length){
                setSoundsIdx(0);
            } else {
                setSoundsIdx(soundsIdx + 1);
            }
            setIsButton1Pressed(false);
        }
    },[isButton1Pressed])

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

    useEffect(() => {
        const interval = setInterval(() => {
            let button1newX = getRandomWidth();
            let button1newY = getRandomHeight();
            setButton1PositionX(button1newX);
            setButton1PositionY(button1newY);
        },timeInterval)
        return () => clearInterval(interval)
    },[])

    const runClock = () => {
        setNumPresses(numPresses+1);
        if(numPresses <= 1){
            setDate1(now());
        }
        if(numPresses >= 29){
            setTimeDiff(Math.abs(date1 - now()).toFixed(3)/1000.0)
            setNumPresses(0);
        }
    }

    const positions1 = () => {
        return {
                position: 'absolute',
                left: button1PositionX,
                top: button1PositionY,    
                width: buttonWidth, 
                height: buttonHeight          
        }        
    }


    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.screen}>
            <Text style={{color: Colors.accent, textAlign: 'center'}}># of presses: {numPresses}, need 30</Text>
            <NumberContainer width={containerWidth*0.5}>{timeDiff} sec.</NumberContainer>
            <View style={{...styles.buttonContainer, marginTop: containerHeight * 0.1}}>
                { !isButton1Pressed && <View style={positions1()} onTouchStart={() => {
                    setIsButton1Pressed(true);
                    Player.playSound(SOUNDS[soundsIdx]);
                    runClock();
                    }}>
                    <MainButton>
                        {PHRASES[phrasesIdx]}
                    </MainButton>
                </View>
                }
            </View>
        </View>
        </LinearGradient>
    );
};

export const screenOptions = {
    headerTitle: "Multi Touch Mode",
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
    buttonContainer: {
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //paddingHorizontal: '10%',
        position: 'absolute',
      },
});



export default PlayScreenMoving;