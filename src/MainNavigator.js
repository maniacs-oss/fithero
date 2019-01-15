/* @flow */

import { StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import theme from './utils/theme';

import tabBarIcon from './components/tabBarIcon';
import i18n from './utils/i18n';
import HomeNavigator from './scenes/HomeNavigator';
import SettingsNavigator from './scenes/SettingsNavigator';

export default createAppContainer(
  createMaterialBottomTabNavigator(
    {
      Home: {
        screen: HomeNavigator,
        navigationOptions: {
          tabBarIcon: tabBarIcon('home'),
          title: i18n.t('menu__home'),
        },
      },
      Settings: {
        screen: SettingsNavigator,
        navigationOptions: {
          tabBarIcon: tabBarIcon('settings'),
          title: i18n.t('menu__settings'),
        },
      },
    },
    {
      initialRouteName: 'Home',
      barStyle: {
        backgroundColor: theme.colors.toolbar,
        borderColor: theme.colors.borderColor,
        borderTopWidth: StyleSheet.hairlineWidth,
      },
      shifting: false,
    }
  )
);
