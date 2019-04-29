/* @flow */

import React, { useMemo } from 'react';
import { processColor, Platform, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import max from 'lodash/max';

import type { ThemeType } from '../../utils/theme/withTheme';
import {
  formatDate,
  getEndOfTheWeek,
  getLastWeeks,
  getToday,
} from '../../utils/date';
import { getWorkoutsByRange } from '../../database/services/WorkoutService';
import useRealmResultsHook from '../../components/useRealmResultsHook';
import type { WorkoutSchemaType } from '../../database/types';
import { groupWorkoutsByWeek } from '../../utils/statistics';

type Props = {
  theme: ThemeType,
};

const WorkoutTimesChart = ({ theme }: Props) => {
  const today = formatDate(getToday(), 'YYYYMMDD');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lastWeeks = useMemo(() => getLastWeeks(5), [today]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endOfTheWeek = useMemo(() => getEndOfTheWeek(), [today]);
  const { data: workouts, timestamp } = useRealmResultsHook<WorkoutSchemaType>(
    getWorkoutsByRange,
    [lastWeeks[0], endOfTheWeek, true]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const groups = useMemo(() => groupWorkoutsByWeek(workouts, lastWeeks), [
    workouts,
    timestamp, // Workouts by Realm it's mutated so we can use timestamp instead
    lastWeeks,
  ]);
  const maxDays = useMemo(() => max(groups), [groups]);

  return (
    <BarChart
      style={styles.chart}
      chartDescription={{
        text: '',
      }}
      data={{
        dataSets: [
          {
            values: groups.map(g => ({ y: g })),
            label: 'days',
            config: {
              color: processColor(theme.colors.chartBar),
              drawValues: false,
            },
          },
        ],
        config: {
          barWidth: 0.7,
        },
      }}
      drawValues={false}
      xAxis={{
        valueFormatter: lastWeeks.map(d => formatDate(d, 'MMM D')),
        textColor: processColor(theme.colors.text),
        gridColor: processColor(theme.colors.text),
        position: 'BOTTOM',
        granularityEnabled: true,
        granularity: 1,
        drawGridLines: false,
        axisLineColor: processColor(theme.colors.text),
        axisLineWidth: 1,
      }}
      yAxis={{
        left: {
          textColor: processColor(theme.colors.text),
          gridColor: processColor(theme.colors.text),
          axisLineColor: processColor(theme.colors.text),
          axisLineWidth: 1,
          granularityEnabled: true,
          granularity: 1,
          spaceBottom: 0,
          // TODO configure the 5 as a setting on how many days a week the user plans to exercise
          axisMaximum: maxDays > 5 ? maxDays : 5,
          axisMinimum: 0,
          textSize: 12,
          gridDashedLine: {
            lineLength: Platform.OS === 'ios' ? 10 : 30,
            spaceLength: Platform.OS === 'ios' ? 5 : 15,
            phase: 0,
          },
          limitLines: [
            {
              limit: 0,
              lineColor: processColor(theme.colors.text),
              lineWidth: 1,
            },
          ],
          drawLimitLinesBehindData: false,
        },
        right: {
          enabled: false,
        },
      }}
      touchEnabled={false}
      pinchZoom={false}
      doubleTapToZoomEnabled={false}
      legend={{
        enabled: false,
      }}
      scaleEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
});

export default WorkoutTimesChart;
