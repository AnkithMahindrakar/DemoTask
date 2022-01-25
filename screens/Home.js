import React from 'react';
import {StyleSheet, Text, View, Image, Button} from 'react-native';

export default function Home(props) {
  const user = props.user;
  console.log('inAuthenticated', user);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>You're Logged In</Text>
      <Image source={{uri: user.user.photo}} style={styles.image} />
      <Text style={styles.text}>{user.user.name}</Text>
      <Text style={styles.text}>{user.user.email}</Text>
      <View style={{marginTop: 30}}>
        <Button title="SignOut" onPress={props.SignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'darkgrey',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
    color: 'white',
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});
