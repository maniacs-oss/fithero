/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
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
    this.props.navigation.navigate('Exercises', { day });
  };

  _onExercisePress = (exerciseKey: string, customExerciseName?: string) => {
    const day = getDay(this.props.navigation.state.params.day);
    this.props.navigation.navigate('EditSets', {
      day,
      exerciseKey,
      exerciseName: customExerciseName,
    });
  };

  render() {
    const { workout } = this.props;

    return (
      <Screen>
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
  list: {
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default connect(
  (state, ownProps) => {
    const day = getDay(ownProps.navigation.state.params.day);
    return {
      workout: state.workouts[day],
    };
  },
  null
)(WorkoutScreen);
