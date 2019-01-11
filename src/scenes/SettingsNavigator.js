/* @flow */

import { createStackNavigator } from 'react-navigation';

import theme from '../utils/theme';
import { defaultNavigationOptions } from '../utils/navigation';
import i18n from '../utils/i18n';
import SettingsScreen from './Settings';

export default createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        title: i18n.t('menu__settings'),
      },
    },
  },
  {
    defaultNavigationOptions,
    cardStyle: {
      backgroundColor: theme.colors.background,
    },
  }
);
