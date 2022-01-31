import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Navigator from './Navigation/Navigator';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const App = props => {
  // dynamicLinks()
  //   .getInitialLink()
  //   .then(link => {
  //     if (link.url === 'https://auxsignin.page.link/aux2')
  //       // ...set initial route as offers screen
  //       console.log('Dynamic link');
  //       // props.navigation.navigate('CallScreen');
  //     }
  //   });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the backgrounddd!', remoteMessage);
    // props.navigation.navigate('CallScreen');
    // AppRegistry.registerComponent(appName, () => CallSceen);
  });
  return <Navigator />;
};

export default App;
