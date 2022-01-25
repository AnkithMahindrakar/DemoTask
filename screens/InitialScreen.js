import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Home from './Home';
import Login from './Login';
import {signIn, signOut, isSignedIn} from '../Callbacks/Callback';
import {webClient_ID, iOSClient_ID} from '../Helper/constant';
import messaging from '@react-native-firebase/messaging';

const InitialScreen = props => {
  const [user, setUser] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [notificationData, setNotificationData] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClient_ID,
      iosClientId: iOSClient_ID,
    });
    console.log('initiated');
    asyncIsSignin();
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        setShowBanner(true);
        setNotificationData(remoteMessage);
        setTimeout(() => setShowBanner(false), 8000);
        console.log('Message received', remoteMessage);
      });
      const unsubscribe2 = messaging().setBackgroundMessageHandler(
        async remoteMessage => {
          //   props.navigation.navigate('CallScreen');
          setShowBanner(true);
          setTimeout(() => setShowBanner(false), 8000);
          console.log('Message handled in the background!', remoteMessage);
        },
      );
      return () => {
        unsubscribe;
        unsubscribe2;
      };
    } catch (err) {
      console.log('ERROR', err);
    }
  }, []);
  const asyncIsSignin = async () => {
    const isSignin = await isSignedIn();
    console.log('isSignin inAsync', isSignin);
    setUser(isSignin);
  };

  const googleSignIn = async () => {
    const userInfo = await signIn();
    setUser(userInfo);
  };
  const googleSignOut = async () => {
    const userInfo = await signOut();
    console.log('user after logout', userInfo);
    setUser(userInfo);
  };

  const notificationBanner = () => {
    return (
      showBanner && (
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => props.navigation.navigate('CallScreen')}>
          <View style={styles.notificationTitleView}>
            <Text style={styles.notificationTitleTxt}>
              {notificationData?.notification.title}
            </Text>
          </View>
          <View style={styles.notificationBodyView}>
            <Text style={styles.notificationBodyTxt} numberOfLines={2}>
              {notificationData?.notification.body}
            </Text>
          </View>
        </TouchableOpacity>
      )
    );
  };
  return (
    <View style={styles.container}>
      {notificationBanner()}
      {user ? (
        <Home SignOut={googleSignOut} user={user} />
      ) : (
        <Login onGoogleButtonPress={googleSignIn} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#404040',
  },
  notificationContainer: {
    position: 'absolute',
    top: 25,
    overflow: 'hidden',
    height: 80,
    width: '96%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 9,
  },
  notificationTitleView: {
    height: 25,
    justifyContent: 'center',
  },
  notificationTitleTxt: {
    color: 'black',
    fontSize: 22,
  },
  notificationBodyView: {
    paddingVertical: 3,
  },
  notificationBodyTxt: {
    color: 'black',
    fontSize: 17,
  },
});
export default InitialScreen;

//628867390932-gp0la4aao3g0bpch0ckaqg7f7dfkf5qh.apps.googleusercontent.com
//628867390932-ei678kq1falkinavnmcd6mbh4qmitesh
// Aux id android 418931418411-dgr5i1r5j42qiqnssdr90m9er34gah4g.apps.googleusercontent.com
//Aux id ios 418931418411-qagt1mhpd622pq204agos9j3hog7i8gr.apps.googleusercontent.com
// 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
