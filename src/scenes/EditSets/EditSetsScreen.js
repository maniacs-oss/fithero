/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWithControls from './EditSetsWithControls';
import ExerciseHeader from '../Exercises/ExerciseHeader';
import EditSetsWithPaper from './EditSetsWithPaper';
import { getExerciseName } from '../../utils/exercises';
import type { EditSetsScreenType } from '../../redux/modules/settings';
import EditSetsTypeIcon from './EditSetsTypeIcon';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: () => void,
  editSetsScreenType: EditSetsScreenType,
  exercise?: WorkoutExerciseSchemaType,
  exercisesCount: number,
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
    exerciseName?: string,
  }>,
};

class EditSetsScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: getExerciseName(
      navigation.state.params.exerciseKey,
      navigation.state.params.exerciseName
    ),
    headerRight: <EditSetsTypeIcon />,
  });

  render() {
    const { dispatch, exercise, exercisesCount, navigation } = this.props;
    const {
      day,
      exerciseKey,
      exerciseName,
    } = this.props.navigation.state.params;

    return (
      <Screen style={styles.container}>
        <ExerciseHeader day={day} style={styles.header} />
        {this.props.editSetsScreenType === 'list' ? (
          <EditSetsWithControls
            testID="edit-sets-with-controls"
            dispatch={dispatch}
            day={day}
            exerciseKey={exerciseKey}
            exercise={exercise}
            exercisesCount={exercisesCount}
          />
        ) : (
          <EditSetsWithPaper
            testID="edit-sets-with-paper"
            dispatch={dispatch}
            day={day}
            exerciseKey={exerciseKey}
            exerciseName={exerciseName}
            exercise={exercise}
            exercisesCount={exercisesCount}
            navigation={navigation}
          />
        )}
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
      editSetsScreenType: state.settings.editSetsScreenType,
      exercise,
      exercisesCount: workout ? workout.exercises.length : 0,
    };
  },
  null
)(EditSetsScreen);
