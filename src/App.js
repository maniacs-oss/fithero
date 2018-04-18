/* @flow */

import * as React from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

import MainNavigator from './MainNavigator';

// react-navigation is fixing it: https://github.com/react-navigation/react-navigation/issues/3956
if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
  ]);
}

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF1B1B',
    accent: '#FF1B1B',
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
