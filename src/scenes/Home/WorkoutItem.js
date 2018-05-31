/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, withTheme } from 'react-native-paper';

import { getExerciseName } from '../../utils/exercises';
import type { ExerciseSchemaType } from '../../database/types';
import { extractExerciseKeyFromDatabase } from '../../database/utils';

type Props = {
  exercise: ExerciseSchemaType,
  onPressItem: (exerciseKey: string) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class WorkoutItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onPressItem(
      extractExerciseKeyFromDatabase(this.props.exercise.id)
    );
  };

  render() {
    const { exercise, theme } = this.props;
    const { secondaryText } = theme.colors;

    return (
      <Card style={styles.card} onPress={this._onPressItem}>
        <View>
          <Text>
            {getExerciseName(extractExerciseKeyFromDatabase(exercise.id))}
          </Text>
          {exercise.sets.length > 0 && (
            <View style={styles.setsContainer}>
              {exercise.sets.map(set => (
                <Text key={set.id} style={{ color: secondaryText }}>{`${
                  set.reps
                }x${set.weight}`}</Text>
              ))}
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
  },
  setsContainer: {
    paddingTop: 8,
  },
});

export default withTheme(WorkoutItem);
