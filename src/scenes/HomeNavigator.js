/* @flow */

import { createStackNavigator } from 'react-navigation';

import i18n from '../utils/i18n';
import theme from '../utils/theme';
import { defaultNavigationOptions } from '../utils/navigation';
import HomeScreen from './Home';
import CalendarScreen from './Calendar';
import ExercisesScreen from './Exercises';
import EditSetsScreen from './EditSets';
import WorkoutScreen from './Workouts';
import ExerciseDetailsScreen from './ExerciseDetails';
import CommentsScreen from './Comments';

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
    ExerciseDetails: {
      screen: ExerciseDetailsScreen,
      navigationOptions: {
        title: null,
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
    Comments: {
      screen: CommentsScreen,
      navigationOptions: {
        title: null,
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
