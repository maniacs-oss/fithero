/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import DataProvider from '../../components/DataProvider';
import {
  getAllWorkoutsWithExercises,
  getWorkoutsThisMonth,
  getWorkoutsThisWeek,
} from '../../database/services/WorkoutService';
import i18n from '../../utils/i18n';
import type {
  WorkoutSetSchemaType,
  WorkoutSchemaType,
} from '../../database/types';
import { getSetsThisWeek } from '../../database/services/WorkoutSetService';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import type {
  DefaultUnitSystemType,
  FirstDayOfTheWeekType,
} from '../../redux/modules/settings';
import { toLb } from '../../utils/metrics';

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
  theme: ThemeType,
};

class StatisticsScreen extends React.Component<Props> {
  render() {
    const { defaultUnitSystem, theme } = this.props;

    return (
      <View style={styles.screen}>
        <View style={styles.row}>
          <Card style={[styles.first, styles.singleCard]}>
            <Text style={styles.singleTitle}>{i18n.t('total_workouts')}</Text>
            <DataProvider
              query={getAllWorkoutsWithExercises}
              parse={(data: Array<WorkoutSchemaType>) =>
                data ? data.length : 0
              }
              render={(data: number) => (
                <Text style={styles.singleNumber}>{data}</Text>
              )}
            />
          </Card>
          <Card style={[styles.last, styles.singleCard]}>
            <Text style={styles.singleTitle}>{i18n.t('this_month')}</Text>
            <DataProvider
              query={getWorkoutsThisMonth}
              parse={(data: Array<WorkoutSchemaType>) =>
                data ? data.length : 0
              }
              render={(data: number) => (
                <Text style={styles.singleNumber}>{data}</Text>
              )}
            />
          </Card>
        </View>
        <View style={styles.row}>
          <Card style={[styles.first, styles.singleCard]}>
            <Text style={styles.singleTitle}>{i18n.t('this_week')}</Text>
            <DataProvider
              query={getWorkoutsThisWeek}
              args={[this.props.firstDayOfTheWeek]}
              parse={(data: Array<WorkoutSchemaType>) =>
                data ? data.length : 0
              }
              render={(data: number) => (
                <Text style={styles.singleNumber}>{data}</Text>
              )}
            />
          </Card>
          <Card style={[styles.last, styles.singleCard]}>
            <Text style={styles.singleTitle}>{i18n.t('week_volume')}</Text>
            <DataProvider
              query={getSetsThisWeek}
              args={[this.props.firstDayOfTheWeek]}
              parse={(data: Array<WorkoutSetSchemaType>) =>
                data.reduce(
                  (previousValue, s) => previousValue + s.reps * s.weight,
                  0
                )
              }
              render={(data: number) => {
                const unit =
                  defaultUnitSystem === 'metric'
                    ? i18n.t('kg.unit', { count: Math.floor(data) })
                    : i18n.t('lb');
                return (
                  <Text style={styles.singleNumber}>
                    {Math.floor(
                      defaultUnitSystem === 'metric' ? data : toLb(data)
                    )}{' '}
                    <Text
                      style={[
                        styles.unit,
                        { color: theme.colors.secondaryText },
                      ]}
                    >
                      {unit}
                    </Text>
                  </Text>
                );
              }}
            />
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  first: {
    marginRight: 4,
  },
  last: {
    marginLeft: 4,
  },
  singleCard: {
    flex: 0.5,
    padding: 16,
  },
  singleTitle: {
    fontSize: 14,
    paddingBottom: 8,
  },
  singleNumber: {
    fontSize: 18,
  },
  unit: {
    fontSize: 14,
  },
});

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
    firstDayOfTheWeek: state.settings.firstDayOfTheWeek,
  }),
  null
)(withTheme(StatisticsScreen));
