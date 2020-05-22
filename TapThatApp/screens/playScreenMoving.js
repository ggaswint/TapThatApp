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
    const [buttonWidth, setButtonWidth] = useState(125);
    const [buttonHeight, setButtonHeight] = useState(270.66);
    const [button1PositionX, setButton1PositionX] = useState(Math.floor(Math.random()*(containerWidth*0.16)))
    const [button1PositionY, setButton1PositionY] = useState(Math.floor(Math.random()*(containerHeight - buttonHeight)))
    const [button2PositionX, setButton2PositionX] = useState(Math.floor(Math.random()*(containerWidth*0.16)) + (containerWidth / 2))
    const [button2PositionY, setButton2PositionY] = useState(Math.floor(Math.random()*(containerHeight - buttonHeight)))

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

    useEffect(() => {
        if(isButton1Pressed && isButton2Pressed){
            setButton1PositionX(Math.floor(Math.random()*(containerWidth*0.16)));
            setButton1PositionY(Math.floor(Math.random()*(containerHeight - buttonHeight)))
            setButton2PositionX(Math.floor(Math.random()*(containerWidth*0.16)) + (containerWidth / 2))
            setButton2PositionY(Math.floor(Math.random()*(containerHeight - buttonHeight)))
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
            setIsButton1Pressed(false);
            setIsButton2Pressed(false);
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

    const getRandomWidth = () => {
        return Math.floor(Math.random()*(Dimensions.get('window').width - buttonWidth))
    }

    const getLeftOrRight = () => {
        return Math.floor(Math.random()*2)
    }

    const getRandomWidthNoClash = () => {
        let posX = Math.floor(Math.random()*(Dimensions.get('window').width - buttonWidth));
        const range = Dimensions.get('window').width - buttonWidth;
        if((posX - buttonWidth) <= 0){
            return {one: posX, two: Math.floor(Math.random()*(range - posX - buttonWidth)) + posX + buttonWidth}
        }
        if (getLeftOrRight() <= 1) {
            return {one: posX, two: Math.floor(Math.random()*(posX - buttonWidth))};
        } else {
            return {one: posX, two: Math.floor(Math.random()*(range - posX - buttonWidth)) + posX + buttonWidth};
        }
    }

    const getRandomHeight = () => {
        if (Dimensions.get('window').height < Dimensions.get('window').width){
            return Math.floor(Math.random()*(Dimensions.get('window').height*0.5) + Dimensions.get('window').height*0.12)
        }
        return Math.floor(Math.random()*(Dimensions.get('window').height - buttonHeight))
    }

    useEffect(() => {
        const interval = setInterval(() => {
            let button1newX = getRandomWidth();
            let button2newX = getRandomWidth();
            let button1newY = getRandomHeight();
            let button2newY = getRandomHeight();
            if(Math.abs(button1newY - button2newY) < buttonHeight){
                let positionsX = getRandomWidthNoClash();
                setButton1PositionX(positionsX.one);
                setButton2PositionX(positionsX.two);
            } else {
                setButton1PositionX(button1newX);
                setButton2PositionX(button2newX);                
            }
            setButton1PositionY(button1newY);
            setButton2PositionY(button2newY);
        },timeInterval)
        return () => clearInterval(interval)
    },[])

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

    const positions1 = () => {
        return {
                position: 'absolute',
                left: button1PositionX,
                top: button1PositionY,    
                width: buttonWidth, 
                height: buttonHeight          
        }        
    }

    const positions2 = () => {
        return {
                position: 'absolute',
                left: button2PositionX,
                top: button2PositionY,        
                width: buttonWidth, 
                height: buttonHeight              
        }        
    }

    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.screen}>
            <NumberContainer width={containerWidth*0.5}>{timeDiff} sec.</NumberContainer>
            <View style={{...styles.buttonContainer, marginTop: containerHeight * 0.1}}>
                { !isButton1Pressed && <View style={positions1()} onTouchStart={() => {
                    setDate1(now());
                    Player.playSound(SOUNDS[soundsIdx]);
                    setIsButton1Pressed(true);
                    }}>
                    <MainButton>
                        {PHRASES[phrasesIdx]}
                    </MainButton>
                </View>
                }
                { !isButton2Pressed && <View style={positions2()} onTouchStart={() => {
                    //const dateX = new Date(new Date().getTime()).getTime();
                    setDate2(now());
                    Player.playSound(SOUNDS[soundsIdx+1]);
                    setIsButton2Pressed(true);
                    }}>                    
                    <MainButton>
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
    headerTitle: "Dynamic mode",
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