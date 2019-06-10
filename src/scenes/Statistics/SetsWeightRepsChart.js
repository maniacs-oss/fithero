/* @flow */

import React, { useMemo, useCallback } from 'react';
import { processColor, Platform, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';

import type { ThemeType } from '../../utils/theme/withTheme';
import { formatDate, getLastWeeks, getToday } from '../../utils/date';
import useRealmResultsHook from '../../components/useRealmResultsHook';
import type { WorkoutSchemaType } from '../../database/types';
import { groupWorkoutsByWeek } from '../../utils/statistics';
import { getSetsByTypeAndMaxReps } from '../../database/services/WorkoutSetService';

type Props = {
  theme: ThemeType,
};

const SetWeightRepsChart = ({ theme }: Props) => {
  const today = formatDate(getToday(), 'YYYYMMDD');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lastWeeks = useMemo(() => getLastWeeks(12), [today]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { data: sets, timestamp } = useRealmResultsHook<WorkoutSchemaType>(
    useCallback(() => getSetsByTypeAndMaxReps('barbell-dead-lifts', 6), [])
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const groups = useMemo(() => groupWorkoutsByWeek(sets, lastWeeks), [
    sets,
    timestamp, // Workouts by Realm it's mutated so we can use timestamp instead
    lastWeeks,
  ]);

  return (
    <LineChart
      marker={{
        enabled: true,
        markerColor: processColor(theme.colors.chartBar),
        textColor: processColor('black'),
      }}
      style={styles.chart}
      chartDescription={{
        text: '',
      }}
      data={{
        dataSets: [
          {
            values: sets.map(set => ({
              y: set.weight,
              marker: `${set.weight} kg`,
            })),
            label: 'days',
            config: {
              color: processColor(theme.colors.chartBar),
              drawValues: false,
              drawCircles: false,
              lineWidth: 2,
            },
          },
        ],
        config: {
          barWidth: 0.7,
        },
      }}
      drawValues={false}
      xAxis={{
        valueFormatter: sets.map(s => formatDate(s.date, 'MMM D')),
        textColor: processColor(theme.colors.text),
        gridColor: processColor(theme.colors.text),
        position: 'BOTTOM',
        granularityEnabled: true,
        granularity: 0,
        drawGridLines: false,
        axisLineColor: processColor(theme.colors.text),
        axisLineWidth: 0,
      }}
      yAxis={{
        left: {
          textColor: processColor(theme.colors.text),
          gridColor: processColor(theme.colors.text),
          axisLineColor: processColor(theme.colors.text),
          axisLineWidth: 1,
          granularityEnabled: true,
          granularity: 5,
          spaceBottom: 0,
          // axisMaximum: 120,
          // axisMinimum: 78,
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
      touchEnabled={true}
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

export default SetWeightRepsChart;
