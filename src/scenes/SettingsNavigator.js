/* @flow */

import { createStackNavigator } from 'react-navigation';

import i18n from '../utils/i18n';
import SettingsScreen from './Settings';

export default createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: i18n.t('menu__settings'),
    },
  },
});
