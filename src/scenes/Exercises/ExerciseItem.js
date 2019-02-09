/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, TouchableRipple } from 'react-native-paper';

import { getExerciseName, getExerciseMuscleName } from '../../utils/exercises';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';
import type { ExerciseSchemaType } from '../../database/types';

type Props = {
  exercise: ExerciseSchemaType,
  onPressItem: (exercise: ExerciseSchemaType) => void,
  theme: ThemeType,
};

class ExerciseItem extends React.PureComponent<Props> {
  _toggleCheck = () => {
    this.props.onPressItem(this.props.exercise);
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
            {getExerciseName(exercise.id, exercise.name)}
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
