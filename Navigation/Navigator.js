import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CallScreen from '../screens/CallScreen';
import Notification from '../screens/Notification';
import InitialScreen from '../screens/InitialScreen';
import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const deepLinksConf = {
    initialRouteName: 'InitialScreen',
    screens: {
      InitialScreen: 'InitialScreen',
      CallScreen: 'CallScreen',
      Notification: 'Notification',
    },
  };
  const linking = {
    prefixes: ['auxsignin://', 'https://app.auxsignin.com'],
    config: deepLinksConf,
    async getInitialURL() {
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL();
      console.log('1.URL', url);

      if (url != null) {
        return url;
      }

      // Check if there is an initial firebase notification
      const message = await messaging().getInitialNotification();
      console.log('2.Get iniatial notification', message.data.link);

      // Get deep link from data
      // if this is undefined, the app will open the default/home page
      return message?.data?.link;
    },
    subscribe(listener) {
      const onReceiveURL = ({url}) => listener(url);

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', onReceiveURL);

      // Listen to firebase push notifications
      const unsubscribeNotification = messaging().onNotificationOpenedApp(
        message => {
          console.log('3.On Notification Opened', message);
          const url = message?.data?.link;

          if (url) {
            // Any custom logic to check whether the URL needs to be handled

            // Call the listener to let React Navigation handle the URL
            listener(url);
          }
        },
      );

      // return () => {
      //   // Clean up the event listeners
      //   Linking.removeEventListener('url', onReceiveURL);
      //   unsubscribeNotification();
      // };
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="InitialScreen" component={InitialScreen} />
        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="Notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigator;
