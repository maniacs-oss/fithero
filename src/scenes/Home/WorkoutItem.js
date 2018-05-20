/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import {
  extractExerciseKeyFromDatabase,
  getExerciseName,
} from '../../utils/exercises';
import type { ExerciseSchemaType } from '../../database/types';

type Props = {
  exercise: ExerciseSchemaType,
};

class WorkoutItem extends React.PureComponent<Props> {
  render() {
    const { exercise } = this.props;
    return (
      <Card style={styles.card}>
        <View>
          <Text>
            {getExerciseName(extractExerciseKeyFromDatabase(exercise.id))}
          </Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default WorkoutItem;
