/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, TouchableRipple, withTheme } from 'react-native-paper';

import type { ExerciseType } from '../../types';
import {
  getExerciseName,
  getExerciseCategoryName,
} from '../../utils/exercises';

type Props = {
  exercise: ExerciseType,
  onPress: (exerciseKey: string) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class ExerciseItem extends React.PureComponent<Props> {
  _toggleCheck = () => {
    this.props.onPress(this.props.exercise.id);
  };

  render() {
    const { exercise, theme } = this.props;
    return (
      <TouchableRipple onPress={this._toggleCheck}>
        <View style={styles.row}>
          <Paragraph
            style={styles.firstLine}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getExerciseName(exercise.id)}
          </Paragraph>
          <Paragraph
            style={{ color: theme.colors.secondaryText }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getExerciseCategoryName(exercise.category)}
          </Paragraph>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    height: 48 + 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  firstLine: {
    fontSize: 15,
  },
});

export default withTheme(ExerciseItem);
