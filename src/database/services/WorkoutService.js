/* @flow */

import realm from '../index';

import type { WorkoutSchemaType } from '../types';
import type { RealmResults } from '../../types';
import {
  getFirstAndLastMonthDay,
  getFirstAndLastWeekday,
  getToday,
} from '../../utils/date';
import type { FirstDayOfTheWeekType } from '../../redux/modules/settings';

export const getAllWorkouts = (): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout');

export const getWorkoutsByRange = (start: Date, end: Date) =>
  realm.objects('Workout').filtered(`date >= $0 AND date <= $1`, start, end);

export const getWorkoutById = (id: string): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout').filtered(`id = $0`, id);

export const getWorkoutsThisWeek = (
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  const [start, end] = getFirstAndLastWeekday(getToday(), firstDayOfTheWeek);
  return getWorkoutsByRange(start, end);
};

export const getWorkoutsThisMonth = () => {
  const [start, end] = getFirstAndLastMonthDay(getToday());
  return getWorkoutsByRange(start, end);
};
