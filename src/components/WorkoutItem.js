/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { getExerciseName } from '../utils/exercises';
import type { ExerciseSchemaType, SetSchemaType } from '../database/types';
import { extractExerciseKeyFromDatabase } from '../database/utils';
import i18n from '../utils/i18n';
import withMaxSet from './withMaxSet';
import type { ThemeType } from '../utils/theme/withTheme';
import withTheme from '../utils/theme/withTheme';

type Props = {
  exercise: ExerciseSchemaType,
  onPressItem: (exerciseKey: string) => void,
  maxSetId: string,
  theme: ThemeType,
};

class WorkoutItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onPressItem(
      extractExerciseKeyFromDatabase(this.props.exercise.id)
    );
  };

  _renderSet = (set: SetSchemaType, index: number) => {
    const { colors } = this.props.theme;
    const isMaxSet = this.props.maxSetId === set.id;
    const color = isMaxSet ? colors.trophy : colors.secondaryText;

    return (
      <View key={set.id} style={styles.setRow}>
        <Text style={[styles.setIndex, { color }]}>{`${index + 1}.`}</Text>
        <Text style={[styles.setWeight, { color }]}>{`${set.weight} ${i18n.t(
          'kg_unit',
          { count: set.weight }
        )}`}</Text>
        <Text style={[styles.setReps, { color }]}>{`${set.reps} ${i18n.t(
          'reps_unit',
          { count: set.reps }
        )}`}</Text>
      </View>
    );
  };

  render() {
    const { exercise } = this.props;

    return (
      <Card style={styles.card} onPress={this._onPressItem}>
        <View>
          <Text>
            {getExerciseName(extractExerciseKeyFromDatabase(exercise.id))}
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

export default withTheme(withMaxSet(WorkoutItem));
