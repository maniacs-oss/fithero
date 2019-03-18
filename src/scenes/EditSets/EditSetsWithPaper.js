/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Subheading, Title } from 'react-native-paper';

import i18n from '../../utils/i18n';
import { generateSummary, parseSummary } from '../../utils/exercisePaper';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import { getExerciseName } from '../../utils/exercises';
import { getExerciseSchemaId } from '../../database/utils';
import { toDate } from '../../utils/date';
import {
  addExercise,
  updateExercisePaperForWorkout,
} from '../../database/services/WorkoutExerciseService';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import type { NavigationType } from '../../types';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import { toKg } from '../../utils/metrics';

type Props = {
  day: string,
  defaultUnitSystem: DefaultUnitSystemType,
  exerciseKey: string,
  exerciseName?: string,
  // eslint-disable-next-line react/no-unused-prop-types
  exercise: ?WorkoutExerciseSchemaType,
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
    exerciseName?: string,
  }>,
  theme: ThemeType,
};

type State = {
  exerciseSummary: string,
  numberOfSets: number,
};

export class EditSetsWithPaper extends React.Component<Props, State> {
  setsAreSaved: boolean;
  willBlurSubscription: {
    remove: () => void,
  };

  state = {
    exerciseSummary: '',
    numberOfSets: 0,
  };

  constructor(props: Props) {
    super(props);
    const { exercise } = this.props;
    if (exercise) {
      const unit = exercise ? exercise.weight_unit : props.defaultUnitSystem;
      this.state = {
        exerciseSummary: generateSummary(
          {
            sets: exercise.sets,
            comments: exercise.comments,
          },
          unit
        ),
        numberOfSets: exercise.sets.length,
      };
    }
    this.setsAreSaved = false;
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      () => {
        this.setsAreSaved = true;
        this._saveSets();
      }
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.defaultUnitSystem !== this.props.defaultUnitSystem &&
      nextProps.exercise
    ) {
      const unit = nextProps.exercise
        ? nextProps.exercise.weight_unit
        : nextProps.defaultUnitSystem;
      this.setState({
        exerciseSummary: generateSummary(
          {
            sets: nextProps.exercise.sets,
            comments: nextProps.exercise.comments,
          },
          unit
        ),
      });
    }
  }

  componentWillUnmount() {
    this.willBlurSubscription.remove();
    if (!this.setsAreSaved) {
      // This case is only for the swipe gesture on iOS
      this._saveSets();
    }
  }

  _saveSets = () => {
    const { day, defaultUnitSystem, exerciseKey, exercise } = this.props;
    const { exerciseSummary } = this.state;
    const { comments, sets } = parseSummary(exerciseSummary, day, exerciseKey);
    const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
    const date = toDate(day);

    const unit = exercise ? exercise.weight_unit : defaultUnitSystem;

    const newExercise = {
      id: exerciseIdDb,
      comments,
      sets:
        unit === 'metric'
          ? sets
          : sets.map(s => ({ ...s, weight: toKg(s.weight) })),
      type: exerciseKey,
      date,
      weight_unit: exercise ? exercise.weight_unit : defaultUnitSystem,
    };

    if (!exercise && newExercise.sets.length > 0) {
      // New one recently added
      addExercise(newExercise);
    }

    if (exercise) {
      updateExercisePaperForWorkout(newExercise);
    }
  };

  _onValueChange = (value: string) => {
    const { day, exerciseKey } = this.props;
    const { sets } = parseSummary(value, day, exerciseKey);

    this.setState({ exerciseSummary: value, numberOfSets: sets.length });
  };

  render() {
    const { exerciseKey, exerciseName, theme } = this.props;
    const { exerciseSummary, numberOfSets } = this.state;

    return (
      <View style={styles.container}>
        <Title style={styles.title}>
          {getExerciseName(exerciseKey, exerciseName)}
        </Title>
        <Subheading>{`${numberOfSets} ${i18n
          .t(numberOfSets === 1 ? 'set' : 'sets')
          .toLowerCase()}`}</Subheading>
        <TextInput
          autoFocus={false}
          autoCorrect={false}
          multiline
          underlineColorAndroid="transparent"
          selectionColor={theme.colors.textSelection}
          style={[{ color: theme.colors.text }, styles.textArea]}
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
    textAlignVertical: 'top',
  },
});

export default withTheme(EditSetsWithPaper);
