import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

const HighScoreItem = props => {
  return (
    <View style={styles.placeItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>name: {props.userName}</Text>
        <Text style={styles.title}>score: {props.score}s</Text>
        <Text style={styles.address}>game level: {props.gameLevel}</Text>
        <Text style={styles.address}>date: {props.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1
  },
  infoContainer: {
    marginLeft: 25,
    width: 250,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    color: 'black',
    fontSize: 18,
    //marginBottom: 5
  },
  address: {
    color: '#666',
    fontSize: 16
  }
});

export default HighScoreItem;