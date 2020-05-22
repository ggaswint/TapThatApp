import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const NumberContainer = props => {
    return (
        <View style={{...styles.container, width: props.width, marginHorizontal: props.width*0.5}}>
            <Text style={styles.number}>{props.children}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.accent,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    //width: Dimensions.get('window').width*0.5,
  },
  number: {
    color: Colors.accent,
    fontSize: 22
  }
});

export default NumberContainer;
