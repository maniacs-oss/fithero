/* @flow */

import { createStackNavigator } from 'react-navigation';
import { Colors } from 'react-native-paper';

import i18n from './utils/i18n';

import HomeNavigator from './scenes/HomeNavigator';
import ExercisesScreen from './scenes/Exercises';
import EditSetsScreen from './scenes/EditSets';
import CalendarScreen from './scenes/Calendar';
import WorkoutScreen from './scenes/Workouts';

export default createStackNavigator(
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
    navigationOptions: {
      title: 'Dziku',
      headerStyle: {
        backgroundColor: Colors.grey900,
        borderBottomColor: Colors.grey900,
      },
      headerTintColor: Colors.white,
      headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
    },
    cardStyle: {
      backgroundColor: Colors.grey900,
    },
  }
);
