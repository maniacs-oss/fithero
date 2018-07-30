/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, TouchableRipple, withTheme } from 'react-native-paper';

import type { ExerciseType } from '../../types';
import { getExerciseName, getExerciseMuscleName } from '../../utils/exercises';

type Props = {
  exercise: ExerciseType,
  onPressItem: (exerciseKey: string) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class ExerciseItem extends React.PureComponent<Props> {
  _toggleCheck = () => {
    this.props.onPressItem(this.props.exercise.id);
  };

  render() {
    const { exercise, theme } = this.props;
    return (
      <TouchableRipple onPress={this._toggleCheck}>
        <View style={styles.row}>
          <Paragraph
            style={styles.firstLine}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {getExerciseName(exercise.id)}
          </Paragraph>
          <Paragraph
            style={{ color: theme.colors.secondaryText }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exercise.primary.map(m => getExerciseMuscleName(m)).join(', ')}
          </Paragraph>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  firstLine: {
    fontSize: 15,
  },
});

export default withTheme(ExerciseItem);
