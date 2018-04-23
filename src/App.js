/* @flow */

import * as React from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

import MainNavigator from './MainNavigator';

if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    // https://github.com/react-navigation/react-navigation/issues/3956
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    // https://github.com/facebook/react-native/issues/18201
    'Warning: Class RCTCxxModule was not exported',
  ]);
}

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#F44336',
    accent: '#F44336',
    secondaryText: 'rgba(255, 255, 255, .7)',
  },
};

export default class App extends React.Component<{}> {
  render() {
    return (
      <PaperProvider theme={theme}>
        <React.Fragment>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <MainNavigator />
        </React.Fragment>
      </PaperProvider>
    );
  }
}
