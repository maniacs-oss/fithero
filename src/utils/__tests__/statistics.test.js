/* @flow */

import moment from 'moment';

import { groupWorkoutsByWeek } from '../statistics';
import { toDate } from '../date';

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

const weeks = [
  moment('2019-03-23T23:00:00.000Z').toDate(),
  moment('2019-03-30T23:00:00.000Z').toDate(),
  moment('2019-04-06T22:00:00.000Z').toDate(),
  moment('2019-04-13T22:00:00.000Z').toDate(),
  moment('2019-04-20T22:00:00.000Z').toDate(),
];

test('groupWorkoutsByWeek', () => {
  const groups = groupWorkoutsByWeek(mockWorkouts, weeks);
  expect(groups).toEqual([0, 0, 1, 2, 2]);
});
