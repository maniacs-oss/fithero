/* @flow */

import * as React from 'react';
import { AsyncStorage, Platform, StatusBar, YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';

import store from './redux/configureStore';
import MainNavigator from './MainNavigator';
import theme from './utils/theme';
import { Settings } from './utils/constants';
import { initSettings } from './redux/modules/settings';
import { getDefaultUnitSystemByCountry } from './utils/metrics';

if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    // https://github.com/react-navigation/react-navigation/issues/3956
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    // https://github.com/facebook/react-native/issues/18201
    'Warning: Class RCTCxxModule was not exported',
  ]);
}

const navigationPersistenceKey = global.__DEV__
  ? 'DEV_dziku-navigation-key'
  : null;

export default class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
    this._loadSettings();
  }

  _loadSettings = async () => {
    // TODO Do it in the SplashScreen and render content after it
    const editSetsScreenType = await AsyncStorage.getItem(
      Settings.editSetsScreen
    );
    let defaultUnitSystem = await AsyncStorage.getItem(
      Settings.defaultUnitSystem
    );
    if (defaultUnitSystem == null) {
      defaultUnitSystem = getDefaultUnitSystemByCountry();
      await AsyncStorage.setItem(Settings.defaultUnitSystem, defaultUnitSystem);
    }
    store.dispatch(
      initSettings({
        editSetsScreenType: editSetsScreenType || 'list',
        defaultUnitSystem,
      })
    );
  };

  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <React.Fragment>
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            <MainNavigator persistenceKey={navigationPersistenceKey} />
          </React.Fragment>
        </PaperProvider>
      </Provider>
    );
  }
}
