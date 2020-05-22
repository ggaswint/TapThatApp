import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, FlatList, Text, View, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import HighScoreItem from '../components/HighScoreItem';
import * as highScoreActions from '../store/actions/highScores';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import { isAvailable } from 'expo/build/AR';

const highScoresScreen = props => {
    const highScores = useSelector(state => state.highScores.filteredScores);
    //const filters = useSelector(state => state.highScores.filters);
    //const isGuest = useSelector(state => !!state.auth.isGuest);
    //const profile = useSelector(state => state.profile.profile);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const sortedScores = [].concat(highScores).sort((a,b) => a.score > b.score ? 1 : -1) //.map((item, i) => <div key={i}> {item.userName} {item.gameLevel} {item.score} {item.date} </div>)

    const loadHighScores = useCallback(() => {
        setError(null);
        setIsRefreshing(true);
        //const appliedFilters = {
        //    guest: isGuest,
        //    isSelf: filters.self,
        //    isFriend: filters.friends,
        //    isBasic: filters.basic,
        //    isDynamicEasy: filters.dynamicEasy,
        //    isDynamicHard: filters.dynamicHard, 
        //    isManyTouch: filters.ManyTouch
        //};
        //if (profile.length === 0){
        //    dispatch(highScoreActions.filterScores(appliedFilters,null,null));
        //} else {
        //    dispatch(highScoreActions.filterScores(appliedFilters,!profile[0] ? ' ' : profile[0].ownerId,profile[0].friends));
        //}
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
        loadHighScores()
        setIsLoading(false);
    }, [dispatch, loadHighScores]);

    if (error) {
        return (<View style={styles.centered}>
            <Text>Error {error}</Text>
            <Button title="try again" onPress={loadHighScores} color={Colors.primary} />
        </View>
        );
    }

    if (isLoading) {
        return (<View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
        );
    }

    if (!isLoading && highScores.length === 0) {
        return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.centered}>
            <Text style={{textAlign: 'center', color: Colors.primary}}>No scores found, maybe start adding some or try changing filters</Text>
        </View>
        </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.screen}>
            <FlatList 
            data={sortedScores} 
            keyExtractor={item => item.id} 
            renderItem={itemData =>
                    <HighScoreItem
                    userName={itemData.item.userName} 
                    gameLevel={itemData.item.gameLevel} 
                    score={itemData.item.score} 
                    date={itemData.item.date} 
                    >
                    </HighScoreItem>
                }
            />
        </View>
        </LinearGradient>
    );
};

export const screenOptions = navData => {
    return {
    headerTitle: 'High Scores',
    headerStyle: {
        backgroundColor: '#ffedff',
        shadowColor: 'transparent',
    },
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Filters"
                iconName={Platform.OS === 'android' ? 'md-flask' : 'ios-flask'}
                onPress={() => {
                  navData.navigation.navigate('filters');
                }}
              />
            </HeaderButtons>
          )
    };
};

const styles = StyleSheet.create({
    screen: {
        marginTop: 20,
    },
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    gradient: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
});

export default highScoresScreen;