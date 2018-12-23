/* @flow */

import { createAppContainer, createStackNavigator } from 'react-navigation';

import i18n from './utils/i18n';
import theme from './utils/theme';

import HomeNavigator from './scenes/HomeNavigator';
import ExercisesScreen from './scenes/Exercises';
import EditSetsScreen from './scenes/EditSets';
import CalendarScreen from './scenes/Calendar';
import WorkoutScreen from './scenes/Workouts';

export default createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: HomeNavigator,
      },
      Calendar: {
        screen: CalendarScreen,
        navigationOptions: {
          title: i18n.t('calendar'),
        },
      },
      Exercises: {
        screen: ExercisesScreen,
        navigationOptions: {
          title: i18n.t('exercises'),
        },
      },
      EditSets: {
        screen: EditSetsScreen,
        navigationOptions: {
          title: i18n.t('sets'),
        },
      },
      Workouts: {
        screen: WorkoutScreen,
      },
    },
    {
      initialRouteName: 'Home',
      defaultNavigationOptions: {
        title: 'Dziku',
        headerStyle: {
          elevation: 0,
          backgroundColor: theme.colors.toolbar,
          borderBottomColor: theme.colors.toolbar,
        },
        headerTintColor: theme.colors.toolbarTint,
        headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
      },
      cardStyle: {
        backgroundColor: theme.colors.background,
      },
    }
  )
);
