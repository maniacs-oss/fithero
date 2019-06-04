/* @flow */

import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWithControls from './EditSetsWithControls';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import DataProvider from '../../components/DataProvider';

type Props = {
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
  }>,
  defaultUnitSystem: DefaultUnitSystemType,
};

class EditSetsScreen extends Component<Props> {
  render() {
    const { defaultUnitSystem } = this.props;
    const { day, exerciseKey } = this.props.navigation.state.params;

    const id = getExerciseSchemaId(day, exerciseKey);

    return (
      <Screen style={styles.container}>
        <DataProvider
          query={getWorkoutExerciseById}
          args={[id]}
          parse={(data: Array<WorkoutExerciseSchemaType>) =>
            data.length > 0 ? data[0] : null
          }
          render={(exercise: ?WorkoutExerciseSchemaType) => (
            <EditSetsWithControls
              testID="edit-sets-with-controls"
              day={day}
              exerciseKey={exerciseKey}
              exercise={exercise}
              defaultUnitSystem={defaultUnitSystem}
            />
          )}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        paddingTop: 8,
      },
    }),
  },
});

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
  }),
  null
)(EditSetsScreen);
