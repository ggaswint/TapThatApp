import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import {LinearGradient} from 'expo-linear-gradient';

import Colors from '../constants/Colors';
import { filterScores } from '../store/actions/highScores';

const FilterSwitch = props => {
    return (
        <View style={styles.filterContainer}>
        <Text>{props.label}</Text>
        <Switch 
        value={props.state} 
        onValueChange={props.onChange} 
        trackColor={{true: Colors.primary}}
        thumbColor={Platform.OS === 'android' ? Colors.primary : ''}
        />
        </View>
    );
};

const FiltersScreen = props => {
    const { navigation } = props;
    const profile = useSelector(state => state.profile.profile);
    const filters = useSelector(state => state.highScores.filters);

    const [isSelf, setIsSelf] = useState(filters.isSelf);
    const [isFriends, setIsFriends] = useState(filters.isFriend);
    const [isBasic, setIsBasic] = useState(filters.isBasic);
    const [isDynamicEasy, setIsDynamicEasy] = useState(filters.isDynamicEasy);
    const [isDynamicHard, setIsDynamicHard] = useState(filters.isDynamicHard);
    const [isManyTouch, setIsManyTouch] = useState(filters.isManyTouch);

    const dispatch = useDispatch();

    const saveFilters = useCallback(() => {
        const appliedFilters = {
            guest: false,
            self: isSelf,
            friends: isFriends,
            basic: isBasic,
            dynamicEasy: isDynamicEasy,
            dynamicHard: isDynamicHard,
            manyTouch: isManyTouch,
        };
        if(profile.length === 0){
            appliedFilters.guest = true;
            dispatch(filterScores(appliedFilters,null,null));
        } else {
        dispatch(filterScores(appliedFilters,!profile[0] ? ' ' : profile[0].ownerId,profile[0].friends));
        }
        props.navigation.goBack();
    }, [isSelf, isFriends, isBasic, isDynamicEasy, isDynamicHard, isManyTouch, dispatch]);

    useEffect(() => {
      props.navigation.setOptions({
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Save"
              iconName={
                Platform.OS === 'android' ? 'md-save' : 'ios-save'
              }
              onPress={saveFilters}
            />
          </HeaderButtons>
        )
      });
    }, [saveFilters]);

    return (
        <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
        <View style={styles.screen}>
            <Text style={styles.title}>Available Filters</Text>
            <FilterSwitch label='Personal Scores' state={isSelf} onChange={newV => setIsSelf(newV)} />
            <FilterSwitch label='Friends Scores' state={isFriends} onChange={newValue => setIsFriends(newValue)} />
            <FilterSwitch label='Basic level Scores' state={isBasic} onChange={newValue => setIsBasic(newValue)} />
            <FilterSwitch label='Dynamic (easy) level Scores' state={isDynamicEasy} onChange={newValue => setIsDynamicEasy(newValue)} />
            <FilterSwitch label='Dynamic (hard) level Scores' state={isDynamicHard} onChange={newValue => setIsDynamicHard(newValue)} />
            <FilterSwitch label='Many touch level Scores' state={isManyTouch} onChange={newValue => setIsManyTouch(newValue)} />
        </View>
        </LinearGradient>

    )

};

export const screenOptions = (navData) => {
    return {
        headerTitle: 'Filters',
        headerStyle: {
            backgroundColor: '#ffedff',
            shadowColor: 'transparent',
        },
    };
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 22,
        margin: 20,
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10,
    },
    gradient: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
});

export default FiltersScreen;