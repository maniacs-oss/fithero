/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Subheading, Title, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/src/types';

import i18n from '../../utils/i18n';
import { generateSummary, parseSummary } from '../../utils/exercisePaper';
import type { ExerciseSchemaType } from '../../database/types';
import { getExerciseName } from '../../utils/exercises';
import { getExerciseSchemaId } from '../../database/utils';
import { toDate } from '../../utils/date';
import { addExercisePaperForWorkout } from '../../database/services/WorkoutService';

type Props = {
  dispatch: () => void,
  day: string,
  exerciseKey: string,
  // eslint-disable-next-line react/no-unused-prop-types
  exercise: ?ExerciseSchemaType,
  exercisesCount: number,
  theme: Theme,
};

type State = {
  exerciseSummary: string,
  numberOfSets: number,
};

class EditSetsWithPaper extends React.Component<Props, State> {
  state = {
    exerciseSummary: '',
    numberOfSets: 0,
  };

  constructor(props: Props) {
    super(props);
    const { exercise } = this.props;
    if (exercise) {
      this.state = {
        exerciseSummary: generateSummary({
          sets: exercise.sets,
          comments: exercise.comments,
        }),
        numberOfSets: exercise.sets.length,
      };
    }
  }

  componentWillUnmount() {
    // TODO this is too slow here, we need like save button or on press back
    if (this.state.numberOfSets > 0) {
      const {
        day,
        exerciseKey,
        exercise,
        dispatch,
        exercisesCount,
      } = this.props;
      const { exerciseSummary } = this.state;
      const { comments, sets } = parseSummary(
        exerciseSummary,
        day,
        exerciseKey
      );
      const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
      const date = toDate(day);

      addExercisePaperForWorkout(dispatch, date, {
        id: exerciseIdDb,
        comments,
        sets,
        type: exerciseKey,
        date,
        sort: exercise ? exercise.sort : exercisesCount + 1,
      });
    }
  }

  _onValueChange = (value: string) => {
    const { day, exerciseKey } = this.props;
    const { sets } = parseSummary(value, day, exerciseKey);

    this.setState({ exerciseSummary: value, numberOfSets: sets.length });
  };

  render() {
    const { exerciseKey, theme } = this.props;
    const { exerciseSummary, numberOfSets } = this.state;

    return (
      <View style={styles.container}>
        <Title style={styles.title}>{getExerciseName(exerciseKey)}</Title>
        <Subheading>{`${numberOfSets} ${i18n
          .t(numberOfSets === 1 ? 'set' : 'sets')
          .toLowerCase()}`}</Subheading>
        <TextInput
          autoFocus
          autoCorrect={false}
          multiline
          underlineColorAndroid="transparent"
          selectionColor={theme.colors.primary}
          style={[
            { color: theme.colors.text, textAlignVertical: 'top' },
            styles.textArea,
          ]}
          placeholderTextColor={theme.colors.placeholder}
          placeholder={i18n.t('exercise__paper-placeholder')}
          value={exerciseSummary}
          onChangeText={this._onValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  title: {
    paddingTop: 8,
  },
  textArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 24,
    fontSize: Platform.OS === 'ios' ? 16 : 18,
  },
});

export default withTheme(EditSetsWithPaper);
