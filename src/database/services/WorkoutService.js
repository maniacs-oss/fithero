/* @flow */

import realm from '../index';

import type { WorkoutSchemaType } from '../types';
import type { RealmResults } from '../../types';
import {
  getFirstAndLastMonthDay,
  getFirstAndLastWeekday,
  getToday,
  toDate,
} from '../../utils/date';
import type { FirstDayOfTheWeekType } from '../../redux/modules/settings';
import { WORKOUT_SCHEMA_NAME } from '../schemas/WorkoutSchema';

export const getAllWorkouts = (): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout');

export const getAllWorkoutsWithExercises = (): RealmResults<
  WorkoutSchemaType
> => realm.objects('Workout').filtered('exercises.@count > 0');

export const getWorkoutsByRange = (
  start: Date,
  end: Date,
  onlyWithExercises: boolean = false
) =>
  realm
    .objects('Workout')
    .filtered(
      `date >= $0 AND date <= $1${
        onlyWithExercises ? ' AND exercises.@count > 0' : ''
      }`,
      start,
      end
    );

export const getWorkoutById = (id: string): RealmResults<WorkoutSchemaType> =>
  realm.objects('Workout').filtered(`id = $0`, id);

export const getWorkoutsThisWeek = (
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  const [start, end] = getFirstAndLastWeekday(getToday(), firstDayOfTheWeek);
  return getWorkoutsByRange(start, end, true);
};

export const getWorkoutsThisMonth = () => {
  const [start, end] = getFirstAndLastMonthDay(getToday());
  return getWorkoutsByRange(start, end, true);
};

export const getWorkoutComments = (workoutId: string) => {
  const workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);
  if (workout) {
    return workout.comments ? workout.comments : '';
  }
  return '';
};

export const setWorkoutComments = (workoutId: string, comments: string) => {
  realm.write(() => {
    let workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);
    if (!workout) {
      workout = realm.create(WORKOUT_SCHEMA_NAME, {
        id: workoutId,
        date: toDate(workoutId),
      });
    }
    workout.comments = comments;
  });
};

export const deleteWorkoutComments = (workoutId: string) => {
  realm.write(() => {
    const workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);
    if (workout) {
      if (workout.exercises.length === 0) {
        realm.delete(workout);
      } else {
        workout.comments = null;
      }
    }
  });
};
