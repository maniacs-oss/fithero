/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import type { ExerciseSchemaType } from '../../database/types';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWithControls from './EditSetsWithControls';
import ExerciseHeader from '../Exercises/ExerciseHeader';
// import EditSetsWithPaper from './EditSetsWithPaper';
import { getExerciseName } from '../../utils/exercises';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: () => void,
  exercise?: ExerciseSchemaType,
  exercisesCount: number,
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
  }>,
};

class EditSetsScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: getExerciseName(navigation.state.params.exerciseKey),
  });

  render() {
    const { dispatch, exercise, exercisesCount } = this.props;
    const { day, exerciseKey } = this.props.navigation.state.params;

    return (
      <Screen style={styles.container}>
        <ExerciseHeader day={day} style={styles.header} />
        <EditSetsWithControls
          dispatch={dispatch}
          day={day}
          exerciseKey={exerciseKey}
          exercise={exercise}
          exercisesCount={exercisesCount}
        />
        {/* <EditSetsWithPaper */}
        {/* dispatch={dispatch} */}
        {/* day={day} */}
        {/* exerciseKey={exerciseKey} */}
        {/* exercise={exercise} */}
        {/* exercisesCount={exercisesCount} */}
        {/* /> */}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
});

export default connect(
  (state, ownProps: Props) => {
    const { day, exerciseKey } = ownProps.navigation.state.params;
    const workout = state.workouts[day];
    let exercise = null;
    if (workout) {
      exercise = workout.exercises.find(
        e => e.id === getExerciseSchemaId(day, exerciseKey)
      );
    }
    return {
      exercise,
      exercisesCount: workout ? workout.exercises.length : 0,
    };
  },
  null
)(EditSetsScreen);
