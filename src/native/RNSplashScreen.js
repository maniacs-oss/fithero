/* @flow */

import { NativeModules } from 'react-native';
const RNSplashScreen = NativeModules.RNSplashScreen;

export const hideSplashScreen = () => {
  RNSplashScreen.hide();
};
