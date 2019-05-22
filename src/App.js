/* @flow */

import * as React from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StatusBar,
  YellowBox,
} from 'react-native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import store from './redux/configureStore';
import MainNavigator from './MainNavigator';
import { Settings } from './utils/constants';
import { APP_THEME, initSettings } from './redux/modules/settings';
import { getDefaultUnitSystemByCountry } from './utils/metrics';
import {
  firstDayOfTheWeekToNumber,
  getCurrentLocale,
  getWeekStartByLocale,
  setMomentFirstDayOfTheWeek,
} from './utils/date';
import PaperThemeProvider from './PaperThemeProvider';

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
  ? 'DEV_fithero-navigation-key'
  : null;

type State = {
  loading: boolean,
};

export default class App extends React.Component<{}, State> {
  state = {
    loading: true,
  };

  componentDidMount() {
    this._loadSettings();
  }

  _loadSettings = async () => {
    const locale = getCurrentLocale();

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
      firstDayOfTheWeek = getWeekStartByLocale(locale);
      await AsyncStorage.setItem(Settings.firstDayOfTheWeek, firstDayOfTheWeek);
    }
    setMomentFirstDayOfTheWeek(
      locale,
      firstDayOfTheWeekToNumber(firstDayOfTheWeek)
    );

    const appTheme =
      (await AsyncStorage.getItem(Settings.appTheme)) || 'default';

    store.dispatch(
      initSettings({
        defaultUnitSystem,
        firstDayOfTheWeek,
        appTheme: appTheme || 'default',
      })
    );

    if (Platform.OS === 'android') {
      this.baterySaverSubscription = DeviceEventEmitter.addListener(
        'POWER_SAVE_MODE_CHANGED',
        isBatterySaver => {
          store.dispatch({
            type: APP_THEME,
            payload: isBatterySaver ? 'dark' : 'default',
          });
        }
      );
    }

    this.setState({ loading: false });
  };

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.baterySaverSubscription.remove();
    }
  }

  render() {
    return (
      <Provider store={store}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {!this.state.loading && (
          <PaperThemeProvider
            render={appTheme => (
              <MainNavigator
                persistenceKey={navigationPersistenceKey}
                screenProps={{ theme: appTheme }}
              />
            )}
          />
        )}
      </Provider>
    );
  }
}
