//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// create a component
const CallSceen = () => {
  return (
    <View style={styles.container}>
      <Text>Call Sceen May be</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a4a4a',
  },
});

//make this component available to the app
export default CallSceen;
