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
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import DataProvider from '../../components/DataProvider';

type Props = {
  editSetsScreenType: EditSetsScreenType,
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
    const { navigation } = this.props;
    const {
      day,
      exerciseKey,
      exerciseName,
    } = this.props.navigation.state.params;

    const id = getExerciseSchemaId(day, exerciseKey);

    return (
      <Screen style={styles.container}>
        <ExerciseHeader day={day} style={styles.header} />
        <DataProvider
          query={getWorkoutExerciseById}
          args={[id]}
          parse={(data: Array<WorkoutExerciseSchemaType>) =>
            data.length > 0 ? data[0] : null
          }
          render={(exercise: ?WorkoutExerciseSchemaType) =>
            this.props.editSetsScreenType === 'list' ? (
              <EditSetsWithControls
                testID="edit-sets-with-controls"
                day={day}
                exerciseKey={exerciseKey}
                exercise={exercise}
              />
            ) : (
              <EditSetsWithPaper
                testID="edit-sets-with-paper"
                day={day}
                exerciseKey={exerciseKey}
                exerciseName={exerciseName}
                exercise={exercise}
                navigation={navigation}
              />
            )
          }
        />
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
  state => ({
    editSetsScreenType: state.settings.editSetsScreenType,
  }),
  null
)(EditSetsScreen);
