/* @flow */

import realm from '../index';

import type { WorkoutSchemaType } from '../types';
import type { DispatchType, RealmListener } from '../../types';
import { getWorkouts } from '../../redux/modules/workouts';
import { deserializeWorkout } from '../utils';
import {
  getFirstAndLastMonthDay,
  getFirstAndLastWeekday,
  getToday,
} from '../../utils/date';

export const getAllWorkouts = (): RealmListener<Array<WorkoutSchemaType>> =>
  realm.objects('Workout');

const _getWorkoutRanges = (start: Date, end: Date) =>
  realm.objects('Workout').filtered(`date >= $0 AND date <= $1`, start, end);

export const getWorkoutsByRange = (
  dispatch: (fn: DispatchType<Array<WorkoutSchemaType>>) => void,
  startDate: Date,
  endDate: Date
) => {
  const workouts = _getWorkoutRanges(startDate, endDate);

  dispatch(getWorkouts(workouts.map(w => deserializeWorkout(w))));
};

export const getWorkout = (
  dispatch: (fn: DispatchType<Array<WorkoutSchemaType>>) => void,
  date: Date
) => {
  const workouts = realm.objects('Workout').filtered(`date = $0`, date);
  if (workouts.length > 0) {
    dispatch(getWorkouts([deserializeWorkout(workouts[0])]));
  }
};

export const getWorkoutsThisWeek = () => {
  const [start, end] = getFirstAndLastWeekday(getToday());
  return _getWorkoutRanges(start, end);
};

export const getWorkoutsThisMonth = () => {
  const [start, end] = getFirstAndLastMonthDay(getToday());
  return _getWorkoutRanges(start, end);
};
