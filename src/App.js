/* @flow */

import * as React from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import store from './redux/configureStore';
import MainNavigator from './MainNavigator';
import theme from './utils/theme';
import { Settings } from './utils/constants';
import { initSettings } from './redux/modules/settings';
import { getDefaultUnitSystemByCountry } from './utils/metrics';
import { getWeekStartByLocale } from './utils/date';

if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    // https://github.com/react-navigation/react-navigation/issues/3956
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    // https://github.com/facebook/react-native/issues/18201
    'Warning: Class RCTCxxModule was not exported',
    // Comes from react-navigation
    'Async Storage has been extracted',
    // Comes from react-native-tabbed-view-pager-android
    'Accessing view manager configs directly off UIManager',
  ]);
}

const navigationPersistenceKey = global.__DEV__
  ? 'DEV_dziku-navigation-key'
  : null;

type State = {
  loading: boolean,
};

export default class App extends React.Component<{}, State> {
  state = {
    loading: true,
  };

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
    if (defaultUnitSystem === null) {
      defaultUnitSystem = getDefaultUnitSystemByCountry();
      await AsyncStorage.setItem(Settings.defaultUnitSystem, defaultUnitSystem);
    }
    let firstDayOfTheWeek = await AsyncStorage.getItem(
      Settings.firstDayOfTheWeek
    );
    if (firstDayOfTheWeek === null) {
      firstDayOfTheWeek = getWeekStartByLocale();
      await AsyncStorage.setItem(Settings.firstDayOfTheWeek, firstDayOfTheWeek);
    }
    store.dispatch(
      initSettings({
        editSetsScreenType: editSetsScreenType || 'list',
        defaultUnitSystem,
        firstDayOfTheWeek,
      })
    );
    this.setState({ loading: false });
  };

  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <React.Fragment>
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            {!this.state.loading && (
              <MainNavigator persistenceKey={navigationPersistenceKey} />
            )}
          </React.Fragment>
        </PaperProvider>
      </Provider>
    );
  }
}
