/* @flow */

import moment from 'moment';

import { groupWorkoutsByWeek } from '../statistics';
import { getLastWeeks, toDate } from '../date';

jest.mock('moment', () => {
  const realMoment = jest.requireActual('moment');
  return (date: string) =>
    date ? realMoment(date) : realMoment('2019-04-27T00:00:00.000Z');
});

const dates = [
  '2019-04-22T00:00:00.000Z',
  '2019-04-24T00:00:00.000Z',
  '2019-04-16T00:00:00.000Z',
  '2019-04-18T00:00:00.000Z',
  '2019-04-10T00:00:00.000Z',
];

const mockWorkouts = (() => {
  return dates.map(d => ({
    id: moment(d).format('YYYYMMDD'),
    date: toDate(d),
    exercises: [],
    isValid: () => true,
  }));
})();

const weeks = getLastWeeks(5);

test('groupWorkoutsByWeek', () => {
  const groups = groupWorkoutsByWeek(mockWorkouts, weeks);
  expect(groups).toEqual([0, 0, 1, 2, 2]);
});
