/* @flow */

import realm from '../index';

import type { WorkoutSchemaType } from '../types';
import type { DispatchType } from '../../types';
import { getWorkouts } from '../../redux/modules/workouts';
import { deserializeWorkout } from '../utils';

export const getAllWorkouts = () => realm.objects('Workout');

export const getWorkoutsByRange = (
  dispatch: (fn: DispatchType<Array<WorkoutSchemaType>>) => void,
  startDate: Date,
  endDate: Date
) => {
  const workouts = realm
    .objects('Workout')
    .filtered(`date >= $0 AND date <= $1`, startDate, endDate);

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
