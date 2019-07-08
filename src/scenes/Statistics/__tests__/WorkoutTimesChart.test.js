/* @flow */

import * as React from 'react';
import { render } from 'react-native-testing-library';
import { BarChart } from 'react-native-charts-wrapper';
import mockMoment from 'moment';

import theme from '../../../utils/theme';
import WorkoutTimesChart from '../WorkoutTimesChart';
import { toDate } from '../../../utils/date';
import { RealmArray } from '../../../database/services/__tests__/helpers/databaseMocks';

jest.mock('react-native-charts-wrapper');
jest.mock('../../../database/services/WorkoutService', () => ({
  getWorkoutsByRange: () => mockWorkouts,
  getEndOfTheWeek: () => mockMoment('2019-04-27T21:59:59.999Z').toDate(),
}));
jest.mock('../../../utils/date', () => {
  const actualDate = jest.requireActual('../../../utils/date');
  return {
    ...actualDate,
    getToday: () => mockMoment('2019-04-27T21:59:59.999Z'),
    getLastWeeks: () => [
      mockMoment('2019-03-23T23:00:00.000Z').toDate(),
      mockMoment('2019-03-30T23:00:00.000Z').toDate(),
      mockMoment('2019-04-06T22:00:00.000Z').toDate(),
      mockMoment('2019-04-13T22:00:00.000Z').toDate(),
      mockMoment('2019-04-20T22:00:00.000Z').toDate(),
    ],
  };
});

const dates = [
  '2019-04-22T00:00:00.000Z',
  '2019-04-24T00:00:00.000Z',
  '2019-04-16T00:00:00.000Z',
  '2019-04-18T00:00:00.000Z',
  '2019-04-10T00:00:00.000Z',
];

const mockWorkouts = new RealmArray(
  ...(() => {
    return dates.map(d => ({
      id: mockMoment(d).format('YYYYMMDD'),
      date: toDate(d),
      exercises: [],
      isValid: () => true,
    }));
  })()
);

describe('WorkoutTimesChart', () => {
  mockMoment.locale('en');

  it('renders chart props correctly', () => {
    const { queryByType } = render(<WorkoutTimesChart theme={theme} />);
    const barChart = queryByType(BarChart);

    expect(barChart.props.data.dataSets[0].values).toEqual([
      { y: 0 },
      { y: 0 },
      { y: 1 },
      { y: 2 },
      { y: 2 },
    ]);

    expect(barChart.props.xAxis.valueFormatter).toEqual([
      'Mar 24',
      'Mar 31',
      'Apr 7',
      'Apr 14',
      'Apr 21',
    ]);
  });
});
