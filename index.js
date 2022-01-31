/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import CallSceen from './screens/CallScreen';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the backgrounddd!', remoteMessage);
//   // props.navigation.navigate('CallScreen');
//   AppRegistry.registerComponent(appName, () => CallSceen);
// });
AppRegistry.registerComponent(appName, () => App);
