/* @flow */

import realm from '../index';

import type { WorkoutSchemaType } from '../types';
import type { RealmResults } from '../../types';
import {
  getFirstAndLastMonthDay,
  getFirstAndLastWeekday,
  getToday,
} from '../../utils/date';

export const getAllWorkouts = (): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout');

export const getWorkoutsByRange = (start: Date, end: Date) =>
  realm.objects('Workout').filtered(`date >= $0 AND date <= $1`, start, end);

export const getWorkoutById = (id: string): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout').filtered(`id = $0`, id);

export const getWorkoutsThisWeek = () => {
  const [start, end] = getFirstAndLastWeekday(getToday());
  return getWorkoutsByRange(start, end);
};

export const getWorkoutsThisMonth = () => {
  const [start, end] = getFirstAndLastMonthDay(getToday());
  return getWorkoutsByRange(start, end);
};
