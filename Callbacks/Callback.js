import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(error.code);
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(error.code);
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error.code);
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

export const isSignedIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      const userInfo = await getCurrentUserInfo();
      return userInfo;
    } else {
      console.log('Please Login');
    }
  } catch (err) {
    console.log(err);
  }
};

export const signOut = async () => {
  try {
    // await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
};

const getCurrentUserInfo = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    console.log('inCallBacks', userInfo);
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      console.log(error.code);
    } else {
      // some other error
    }
  }
};
