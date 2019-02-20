/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { getExerciseName } from '../utils/exercises';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../database/types';
import { extractExerciseKeyFromDatabase } from '../database/utils';
import i18n from '../utils/i18n';
import type { ThemeType } from '../utils/theme/withTheme';
import withTheme from '../utils/theme/withTheme';
import { getMaxSetByType } from '../database/services/WorkoutSetService';
import type { RealmResults } from '../types';
import DataProvider from './DataProvider';

type Props = {
  exercise: WorkoutExerciseSchemaType,
  customExerciseName?: string,
  onPressItem: (exerciseKey: string, customExerciseName?: string) => void,
  theme: ThemeType,
};

class WorkoutItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onPressItem(
      extractExerciseKeyFromDatabase(this.props.exercise.id),
      this.props.customExerciseName
    );
  };

  _renderSet = (set: WorkoutSetSchemaType, index: number) => (
    <DataProvider
      key={set.id}
      query={getMaxSetByType}
      args={[extractExerciseKeyFromDatabase(this.props.exercise.id)]}
      parse={(sets: RealmResults<WorkoutSetSchemaType>) =>
        sets.length > 0 ? sets[0].id : null
      }
      render={(maxSetId: string) => {
        // $FlowFixMe type RealmObject(s) better
        if (!set.isValid()) {
          // When we delete a set, it can hit this listener first and then when
          // trying to access a deleted set, the app would crash
          return null;
        }
        const { colors } = this.props.theme;
        const isMaxSet = maxSetId === set.id;
        const color = isMaxSet ? colors.trophy : colors.secondaryText;

        return (
          <View style={styles.setRow}>
            <Text style={[styles.setIndex, { color }]}>{`${index + 1}.`}</Text>
            <Text style={[styles.setWeight, { color }]}>{`${i18n.t('kg.value', {
              count: set.weight,
            })}`}</Text>
            <Text style={[styles.setReps, { color }]}>{`${i18n.t('reps.value', {
              count: set.reps,
            })}`}</Text>
          </View>
        );
      }}
    />
  );

  render() {
    const { exercise, customExerciseName } = this.props;

    return (
      <Card style={styles.card} onPress={this._onPressItem}>
        <View>
          <Text>
            {getExerciseName(
              extractExerciseKeyFromDatabase(exercise.id),
              customExerciseName
            )}
          </Text>
          {exercise.sets.length > 0 && (
            <View style={styles.setsContainer}>
              {exercise.sets.map((set, index) => this._renderSet(set, index))}
            </View>
          )}
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  setsContainer: {
    paddingTop: 12,
  },
  setRow: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  setIndex: {
    paddingRight: 8,
  },
  setWeight: {
    flex: 0.3,
    textAlign: 'right',
    paddingRight: 8,
  },
  setReps: {
    flex: 0.25,
    textAlign: 'right',
  },
});

export default withTheme(WorkoutItem);
