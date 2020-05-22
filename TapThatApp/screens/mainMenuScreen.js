import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';
import {useSelector} from 'react-redux';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as profileActions from '../store/actions/profile';
import * as highScoreActions from '../store/actions/highScores';
import {LinearGradient} from 'expo-linear-gradient';

const mainMenuScreen = props => {
    const isGuest = useSelector(state => !!state.auth.isGuest);
    const editedProfile = useSelector(state => state.profile.profile);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width)
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height)
  
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

    const gameHandler = () => {
        props.navigation.navigate('play');
    };

    const game2Handler = () => {
        props.navigation.navigate('playMoving', {timeInterval: 1000, level: 'dynamic (easy)'});
    };

    const game3Handler = () => {
        props.navigation.navigate('playMoving', {timeInterval: 300, level: 'dynamic (hard)'});
    };

    const game4Handler = () => {
        props.navigation.navigate('playManyTouch', {timeInterval: 700, level: 'many touch'});
    };

    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    const scoreHandler = () => {
        props.navigation.navigate('scoreBoard');
    };


    const loadProfile = useCallback(() => {
        setError(null);
        setIsRefreshing(true);
        dispatch(profileActions.fetchProfile()).then(res => {
            setIsRefreshing(false);
        }).catch(err => {
                setError(err.message);
            });
    
    }, [dispatch, setIsLoading, setError])
    
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadProfile);
        return () => {
            unsubscribe();
        };
    }, [loadProfile]);

    const loadHighScores = useCallback(() => {
        setError(null);
        setIsRefreshing(true);
        dispatch(highScoreActions.fetchHighScores()).then(res => {
            setIsRefreshing(false)}).catch(err => {
                setError(err.message);
            });

    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadHighScores);
        return () => {
            unsubscribe();
        };
    }, [loadHighScores]);

    useEffect(() => {
        setIsLoading(true);
        loadProfile()
        loadHighScores()
        setIsLoading(false);
    }, [dispatch, loadProfile, loadHighScores]);
    
    if (error) {
        return (<View style={styles.centered}>
            <Text>Error {error}</Text>
            <Button title="try again" onPress={loadProfile} color={Colors.primary} />
        </View>
        );
    }
    
    if (isLoading) {
        return (<View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
        );
    }
    

    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <ScrollView>
        <View style={styles.container}>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title="Play (basic)" color={Colors.primary} onPress={gameHandler} />
            </View>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title="Play (dynamic easy)" color={Colors.primary} onPress={game2Handler} />
            </View>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title="Play (dynamic hard)" color={Colors.primary} onPress={game3Handler} />
            </View>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title="Play (many touch)" color={Colors.primary} onPress={game4Handler} />
            </View>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title="Scoreboard" color={Colors.primary} onPress={scoreHandler} />
            </View>
            <View style={{...styles.buttonContainer, marginTop: containerHeight*0.05}}>
                <Button title={isGuest ? 'Login' : 'Logout'} color={Colors.primary} onPress={logoutHandler} />
            </View>
        </View>
        </ScrollView>
        </LinearGradient>

    );
} 

export const screenOptions = navData => {
    return {
    headerTitle: 'Menu',
    headerStyle: {
        backgroundColor: '#ffedff',
        shadowColor: 'transparent',
    },
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Edit profile"
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            onPress={() => {
              navData.navigation.navigate('profile');
            }}
          />
        </HeaderButtons>
      )
    };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',      
  },
  gradient: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
},
});

export default mainMenuScreen;