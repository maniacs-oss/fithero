/* @flow */

import * as React from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';

import store from './redux/configureStore';
import MainNavigator from './MainNavigator';
import theme from './utils/theme';

if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    // https://github.com/react-navigation/react-navigation/issues/3956
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    // https://github.com/facebook/react-native/issues/18201
    'Warning: Class RCTCxxModule was not exported',
  ]);
}

export default class App extends React.Component<{}> {
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <React.Fragment>
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            <MainNavigator />
          </React.Fragment>
        </PaperProvider>
      </Provider>
    );
  }
}
