/* @flow */

import { StackNavigator } from 'react-navigation';
import { Colors } from 'react-native-paper';

import i18n from './utils/i18n';

import HomeNavigator from './scenes/HomeNavigator';
import ExercisesScreen from './scenes/Exercises/ExercisesScreen';

export default StackNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Exercises: {
      screen: ExercisesScreen,
      navigationOptions: {
        title: i18n.t('exercises'),
      },
    },
  },
  {
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
