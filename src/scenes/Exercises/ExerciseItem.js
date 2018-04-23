/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Checkbox,
  Paragraph,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';

import type { ExerciseType } from '../../types';
import {
  getExerciseName,
  getExerciseCategoryName,
} from '../../utils/exercises';

type Props = {
  checked: boolean,
  exercise: ExerciseType,
  onPress: (id: string, checked: boolean) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class ExerciseItem extends React.PureComponent<Props> {
  _toggleCheck = () => {
    this.props.onPress(this.props.exercise.id, !this.props.checked);
  };

  render() {
    const { checked, exercise, theme } = this.props;
    return (
      <TouchableRipple onPress={this._toggleCheck}>
        <View style={styles.row}>
          <Checkbox checked={checked} />
          <View style={styles.content}>
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
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    height: 48 + 16,
    paddingLeft: 16,
    paddingRight: Platform.OS === 'android' ? 16 : 8,
    ...Platform.select({
      android: {
        flexDirection: 'row',
      },
      ios: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
      },
    }),
  },
  content: {
    flex: 1,
    ...Platform.select({
      android: {
        position: 'absolute',
        left: 72,
        right: 16,
      },
      ios: {
        paddingLeft: 16,
      },
    }),
  },
  firstLine: {
    fontSize: 15,
  },
});

export default withTheme(ExerciseItem);
