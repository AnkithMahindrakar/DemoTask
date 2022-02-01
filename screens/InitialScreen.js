import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
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
  const [routeName, setRouteName] = useState('');

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('new Deep linking', url);
      navigateHandler(url);
    });
    const unsubscribe = Linking.addEventListener('url', handleOpenURL);

    return () => {
      unsubscribe;
    };
  }, []);
  const handleOpenURL = event => {
    navigateHandler(event.url);
  };
  const navigateHandler = async url => {
    if (url) {
      const route = url.match(/\/([^\/]+)\/?$/)[1];
      console.log('Route on', route);
      props.navigation.navigate(route);
    }
  };

  useEffect(() => {
    const urlLink = 'auxsignin://CallScreen';
    const routing = urlLink.match(/\/([^\/]+)\/?$/)[1];
    const routing2 = urlLink.split('/');
    console.log('-------11', routing);
    // console.log('-------22', routing2);

    // props.navigation.navigate(route);
    try {
      GoogleSignin.configure({
        webClientId: webClient_ID,
        iosClientId: iOSClient_ID,
      });
      console.log('initiated');
      iOSPremmisionHandler();
      asyncIsSignin();
      messaging()
        .getToken()
        .then(token => {
          console.log('Device Token', token);
        });

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        setShowBanner(true);
        setNotificationData(remoteMessage);
        setTimeout(() => setShowBanner(false), 8000);
        console.log('Message received', remoteMessage.data.link);
        const urlLink = remoteMessage.data.link;
        const routing = urlLink.match(/\/([^\/]+)\/?$/)[1];
        setRouteName(routing);
        // console.log('=====', urlLink, '=====', routing);
      });
      return () => {
        unsubscribe;
        // unsubscribe2;
      };
    } catch (err) {
      console.log('ERROR', err);
    }
  }, []);

  // const link = async () => {
  //   const linkObj = await dynamicLinks().getInitialLink();
  //   console.log('link', linkObj);
  // };
  // link();
  const iOSPremmisionHandler = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  const asyncIsSignin = async () => {
    const isSignin = await isSignedIn();
    // console.log('isSignin inAsync', isSignin);
    setUser(isSignin);
  };

  const googleSignIn = async () => {
    const userInfo = await signIn();
    setUser(userInfo);
  };
  const googleSignOut = async () => {
    const userInfo = await signOut();
    // console.log('user after logout', userInfo);
    setUser(userInfo);
  };

  const notificationBanner = () => {
    return (
      showBanner && (
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => {
            setShowBanner(false);
            props.navigation.navigate(routeName);
          }}>
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

//key store SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
//  SHA256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
// npx uri-scheme open auxsignin:// --android
// npx uri-scheme open auxsignin://CallScreen --android
