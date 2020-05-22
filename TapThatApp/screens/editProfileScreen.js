import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import {useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import FriendItem from '../components/FriendItem';
import {LinearGradient} from 'expo-linear-gradient';

import Colors from '../constants/Colors';
import * as profileActions from '../store/actions/profile';

const editProfileScreen = props => {
  const isGuest = useSelector(state => !!state.auth.isGuest);

  const editedProfile = useSelector(state => state.profile.profile);
  const profiles = useSelector(state => state.profile.profiles);

  const [userName, setUserName] = useState(!editedProfile[0] ? '' : editedProfile[0].userName);
  const [curFriends, setCurFriends] = useState(!editedProfile[0] ? ' ' : editedProfile[0].friends);
  const [curOwnerId, setCurOwnerId] = useState(!editedProfile[0] ? ' ' : editedProfile[0].ownerId);

  const [friendName, setFriendName] = useState('');
  const [friends, setFriends] = useState('');
  const [selectedImage, setSelectedImage] = useState(!editedProfile[0] ? ' ' : editedProfile[0].image);
  const dispatch = useDispatch();

  const nameChangeHandler = text => {
    setUserName(text);
  };

  const friendChangeHandler = text => {
    setFriendName(text);
    let strLength = text.length;

    const friendProfilesTemp = profiles.filter(prof => {
        if(typeof prof.userName === 'undefined'){
            return false
        }
        return prof.userName.substring(0,strLength) === text.substring(0,strLength)
    });
    const friendProfiles = friendProfilesTemp.filter(prof => {return prof.ownerId !=  curOwnerId});
    setFriends(friendProfiles);
  };


  const getFriendsHandler = () => {
        const friendProfiles = profiles.filter(prof => {return prof.userName === friendName});
        setFriends(friendProfiles);
  }

  const addFriend = (friend) => {
    let friendList;
    if(typeof editedProfile[0] === 'undefined'){
        Alert.alert('Create/save username first', 'Need a username to add friends', [
            { text: 'Okay' }
          ]);
        return;
    }
    if(editedProfile[0].friends === "no friends"){
        friendList = [friend];
    } else {
        const curFriends = [...editedProfile[0].friends];
        friendList = curFriends.concat(friend);
    }
    if (editedProfile[0].userName !== friend.userName){
        dispatch(profileActions.addFriend(editedProfile[0].id,friendList));
        setCurFriends(friendList);
    }
  }

  const saveProfileHandler = () => {
    if(isGuest){
        Alert.alert('Not logged in', 'Need to be logged in to save profile', [
            { text: 'Okay' }
          ]);
        return;
    }
    if(editedProfile.length === 0){
        dispatch(profileActions.createProfile(userName, selectedImage, "no friends"));
    } else {
        dispatch(profileActions.editProfile(editedProfile[0].id,userName, selectedImage));
    }
    props.navigation.goBack();
  };

  useEffect(() => {
    props.navigation.setOptions({
        headerStyle: {
            backgroundColor: '#ffedff',
            shadowColor: 'transparent',
        },
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-save' : 'ios-save'
            }
            onPress={saveProfileHandler}
          />
        </HeaderButtons>
      )
    });
  }, [saveProfileHandler]);

  const checkIsFriend = (f) => {
    if(typeof curFriends === 'undefined'){
        return false;
    }
    for(let i = 0; i < curFriends.length; i++){
        if (curFriends[i].ownerId === f.ownerId){
            return true;
        }
    }
    return false;
}

  return (
      isGuest ? 
      <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
      <View style={styles.centered}><Text style={{textAlign: 'center', color: Colors.primary}}>Must be logged in to edit profile</Text></View>
      </LinearGradient>
        :
      <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
      <View style={styles.form}>
        <Text style={styles.label}>name</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={nameChangeHandler}
          value={userName}
          initialValue={userName}
        />
        <Text style={styles.label}>Search for friends</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={friendChangeHandler}
          value={friendName}
          initialValue={friendName}
        />
        <Button
          title="Search for specific friend"
          color={Colors.primary}
          onPress={getFriendsHandler}
        />
        <FlatList 
            data={friends} 
            keyExtractor={item => item.id} 
            renderItem={itemData =>
                <View style={styles.placeItem}>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}> name: {itemData.item.userName}</Text>
                  {checkIsFriend(itemData.item) ? <Text>already friends</Text> : <Button color={Colors.primary} title="add friend" onPress={() => {addFriend(itemData.item)}}/>}
                </View>
              </View>
            }
        />
      </View>
      </LinearGradient>
  );
};

export const screenOptions = navData => {
    return {
    headerTitle: 'Profile',
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    form: {
      margin: 30
    },
    label: {
      fontSize: 18,
      marginBottom: 15
    },
    textInput: {
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      marginBottom: 15,
      paddingVertical: 4,
      paddingHorizontal: 2
    },
    placeItem: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
      },
      infoContainer: {
        //flexDirection: 'row',
        //marginLeft: 25,
        //width: 250,
        justifyContent: 'center',
        alignItems: 'center'
      },
      title: {
        color: 'black',
        fontSize: 18,
        alignItems: 'flex-start'
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

export default editProfileScreen;
