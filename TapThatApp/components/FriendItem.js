import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import Colors from '../constants/Colors';

const FriendItem = props => {
  return (
    <View style={styles.placeItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}> name: {props.userName}</Text>
        <Button color={Colors.primary} title="add friend" onPress={props.onAdd.bind(props.ownerId)}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default FriendItem;