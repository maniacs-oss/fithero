/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import WorkoutList from '../../components/WorkoutList';
import {
  getDay,
  getDatePrettyFormat,
  getToday,
  toDate,
} from '../../utils/date';
import { getWorkout } from '../../database/services/WorkoutService';
import type { NavigationType } from '../../types';
import type { WorkoutSchemaType } from '../../database/types';

type Props = {
  dispatch: () => void,
  navigation: NavigationType<{ day: string }>,
  workout: ?WorkoutSchemaType,
};

class WorkoutScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    title: getDatePrettyFormat(navigation.state.params.day, getToday(), true),
  });

  componentDidMount() {
    const day = getDay(this.props.navigation.state.params.day);
    getWorkout(this.props.dispatch, toDate(day));
  }

  _onAddExercises = () => {
    const day = getDay(this.props.navigation.state.params.day);
    this.props.navigation.push('Exercises', { day });
  };

  _onExercisePress = (exerciseKey: string) => {
    const day = getDay(this.props.navigation.state.params.day);
    this.props.navigation.push('EditSets', { day, exerciseKey });
  };

  render() {
    const { workout } = this.props;

    return (
      <Screen style={styles.container}>
        {workout && (
          <WorkoutList
            contentContainerStyle={styles.list}
            workout={workout}
            onPressItem={this._onExercisePress}
          />
        )}
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  list: {
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default withNavigation(
  connect(
    (state, ownProps) => {
      const day = getDay(ownProps.navigation.state.params.day);
      return {
        workout: state.workouts[day],
      };
    },
    null
  )(WorkoutScreen)
);
