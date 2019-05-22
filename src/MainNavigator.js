/* @flow */

import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import tabBarIcon from './components/tabBarIcon';
import i18n from './utils/i18n';
import HomeNavigator from './scenes/HomeNavigator';
import SettingsNavigator from './scenes/SettingsNavigator';
import StatisticsNavigator from './scenes/StatisticsNavigator';
import EditExerciseScreen from './scenes/EditExercise/EditExerciseScreen';

const MainStack = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('home'),
        title: i18n.t('menu__home'),
      },
    },
    Statistics: {
      screen: StatisticsNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('show-chart'),
        title: i18n.t('menu__statistics'),
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
    shifting: false,
    keyboardHidesNavigationBar: false,
  }
);

export default createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: MainStack,
        navigationOptions: {
          header: null,
        },
      },
      EditExercise: {
        screen: EditExerciseScreen,
      },
    },
    {
      mode: 'modal',
      defaultNavigationOptions: {
        gesturesEnabled: false,
      },
    }
  )
);
