/* @flow */

import { createStackNavigator } from 'react-navigation';

import i18n from '../utils/i18n';
import theme from '../utils/theme';
import { defaultNavigationOptions } from '../utils/navigation';
import HomeScreen from './Home';
import CalendarScreen from './Calendar/CalendarScreen';
import ExercisesScreen from './Exercises/ExercisesScreen';
import EditSetsScreen from './EditSets/EditSetsScreen';
import WorkoutScreen from './Workouts/WorkoutScreen';

export default createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
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
    defaultNavigationOptions,
    cardStyle: {
      backgroundColor: theme.colors.background,
    },
  }
);
