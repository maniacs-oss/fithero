/* @flow */

import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
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
import WorkoutTimesChart from './WorkoutTimesChart';

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
  theme: ThemeType,
};

const { width } = Dimensions.get('window');

class StatisticsScreen extends React.Component<Props> {
  render() {
    const { defaultUnitSystem, theme } = this.props;

    return (
      <View style={styles.screen}>
        <ScrollView
          horizontal
          style={styles.carousel}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
        >
          <Card style={[styles.singleCard, styles.first]}>
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
          <Card style={styles.singleCard}>
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
          <Card style={styles.singleCard}>
            <Text style={styles.singleTitle}>{i18n.t('this_week')}</Text>
            <DataProvider
              query={getWorkoutsThisWeek}
              parse={(data: Array<WorkoutSchemaType>) =>
                data ? data.length : 0
              }
              render={(data: number) => (
                <Text style={styles.singleNumber}>{data}</Text>
              )}
            />
          </Card>
          <Card style={[styles.singleCard, styles.last]}>
            <Text style={styles.singleTitle}>{i18n.t('week_volume')}</Text>
            <DataProvider
              query={getSetsThisWeek}
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
        </ScrollView>
        <Card style={styles.chartCard}>
          <Text style={[styles.singleTitle, styles.chartTitle]}>
            {i18n.t('workouts_per_week')}
          </Text>
          <WorkoutTimesChart theme={theme} />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 8,
  },
  carousel: {
    flexGrow: 0,
    marginBottom: 8,
  },
  first: {
    marginLeft: 16,
  },
  last: {
    marginRight: 16,
  },
  singleCard: {
    width: width / 2.5,
    padding: 16,
    marginRight: 8,
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
  chartCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 16,
  },
  chartTitle: {
    paddingBottom: 16,
  },
});

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
    // Even if not using the prop, we use it to re-render if this has changed
    firstDayOfTheWeek: state.settings.firstDayOfTheWeek,
  }),
  null
)(withTheme(StatisticsScreen));
