/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Paragraph, TouchableRipple } from 'react-native-paper';

import { getExerciseName, getExerciseMuscleName } from '../../utils/exercises';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';
import type { ExerciseSchemaType } from '../../database/types';

type Props = {
  exercise: ExerciseSchemaType,
  onPressItem: (exercise: ExerciseSchemaType) => void,
  navigate: (route: string, params?: { [key: string]: mixed }) => void,
  theme: ThemeType,
};

class ExerciseItem extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.exercise !== nextProps.exercise;
  }

  _openExerciseDetail = () => {
    this.props.navigate('ExerciseDetails', { id: this.props.exercise.id });
  };

  _toggleCheck = () => {
    this.props.onPressItem(this.props.exercise);
  };

  render() {
    const { exercise, theme } = this.props;
    return (
      <TouchableRipple onPress={this._toggleCheck}>
        <View style={styles.itemContainer}>
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
          <IconButton
            icon="open-in-new"
            size={24}
            onPress={this._openExerciseDetail}
          />
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
  row: {
    flex: 1,
    paddingTop: 8,
  },
  firstLine: {
    fontSize: 15,
    paddingRight: 8,
  },
});

export default withTheme(ExerciseItem);
