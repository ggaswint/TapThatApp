import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';

import Colors from '../constants/Colors';
import Card from './Card';

const MainButton = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    

  return (
    <TouchableCmp activeOpacity={0.6}>
      <Card style={{...styles.button, ...props.style}}>
        <Text style={styles.buttonText}>{props.children}</Text>
      </Card>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  button: {
    //paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'open-sans',
    fontSize: 18,
    textAlign: 'center',
  }
});

export default MainButton;