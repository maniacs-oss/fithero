/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import DataProvider from '../../components/DataProvider';
import {
  getAllWorkouts,
  getWorkoutsThisMonth,
  getWorkoutsThisWeek,
} from '../../database/services/WorkoutService';
import i18n from '../../utils/i18n';
import type { SetSchemaType, WorkoutSchemaType } from '../../database/types';
import { getSetsThisWeek } from '../../database/services/SetService';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

type Props = {
  theme: ThemeType,
};

class StatisticsScreen extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    return (
      <View style={styles.screen}>
        <View style={styles.row}>
          <Card style={[styles.first, styles.singleCard]}>
            <Text style={styles.singleTitle}>{i18n.t('total_workouts')}</Text>
            <DataProvider
              dataQuery={getAllWorkouts}
              dataParse={(data: Array<WorkoutSchemaType>) =>
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
              dataQuery={getWorkoutsThisMonth}
              dataParse={(data: Array<WorkoutSchemaType>) =>
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
              dataQuery={getWorkoutsThisWeek}
              dataParse={(data: Array<WorkoutSchemaType>) =>
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
              dataQuery={getSetsThisWeek}
              dataParse={(data: Array<SetSchemaType>) =>
                data.reduce(
                  (previousValue, s) => previousValue + s.reps * s.weight,
                  0
                )
              }
              render={(data: number) => {
                const unit = i18n.t('kg.unit', { count: Math.floor(data) });
                return (
                  <Text style={styles.singleNumber}>
                    {data}{' '}
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
    padding: 16,
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

export default withTheme(StatisticsScreen);
