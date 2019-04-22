/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { getDatePrettyFormat } from '../../utils/date';
import i18n from '../../utils/i18n';
import { toLb, toTwoDecimals } from '../../utils/metrics';
import withTheme from '../../utils/theme/withTheme';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import type { ThemeType } from '../../utils/theme/withTheme';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

type Props = {
  exercise: WorkoutExerciseSchemaType,
  maxSetId: string | null,
  theme: ThemeType,
  unit: DefaultUnitSystemType,
  todayString: string,
};

class ExerciseHistoryItem extends React.PureComponent<Props> {
  render() {
    const { exercise, theme, unit, maxSetId, todayString } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.date}>
          {getDatePrettyFormat(exercise.date, todayString)}
        </Text>
        {exercise.sets.map((set, index) => {
          const color =
            set.id === maxSetId ? theme.colors.accent : theme.colors.text;
          return (
            <View key={set.id} style={styles.setRow}>
              <Text style={[styles.setIndex, { color }]}>{`${index +
                1}.`}</Text>
              <Text style={[styles.setWeight, { color }]}>
                {unit === 'metric'
                  ? `${i18n.t('kg.value', {
                      count: toTwoDecimals(set.weight),
                    })}`
                  : `${toTwoDecimals(toLb(set.weight))} ${i18n.t('lb')}`}
              </Text>
              <Text style={[styles.setReps, { color }]}>{`${i18n.t(
                'reps.value',
                {
                  count: set.reps,
                }
              )}`}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  date: {
    paddingBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  setIndex: {
    flex: 0.06,
    paddingRight: 8,
  },
  setWeight: {
    flex: 0.3,
    textAlign: 'right',
    paddingRight: 8,
  },
  setReps: {
    flex: 0.3,
    textAlign: 'right',
  },
});

export default withTheme(ExerciseHistoryItem);
