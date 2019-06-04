/* @flow */

import realm from '../index';
import type { AddWorkoutExerciseSchemaType } from '../types';
import { dateToWorkoutId, getTimeAgo } from '../../utils/date';
import { WORKOUT_EXERCISE_SCHEMA_NAME } from '../schemas/WorkoutExerciseSchema';
import { WORKOUT_SCHEMA_NAME } from '../schemas/WorkoutSchema';

export const getWorkoutExerciseById = (id: string) =>
  realm.objects(WORKOUT_EXERCISE_SCHEMA_NAME).filtered(`id = $0`, id);

export const addExercise = (exercise: AddWorkoutExerciseSchemaType) => {
  realm.write(() => {
    const workoutId = dateToWorkoutId(exercise.date);
    let workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);

    if (!workout) {
      workout = realm.create(WORKOUT_SCHEMA_NAME, {
        id: workoutId,
        date: exercise.date,
      });
    }

    workout.exercises.push({
      ...exercise,
      sort: workout ? workout.exercises.length + 1 : 0,
    });
  });
};

export const deleteWorkoutExercise = (
  exercise: AddWorkoutExerciseSchemaType
) => {
  const workoutId = dateToWorkoutId(exercise.date);
  realm.delete(exercise);
  // Now we check if workout needs to be deleted too
  const workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);
  if (workout.exercises.length > 0) {
    // If workout was not deleted, but one exercise yes, let's fix the sort
    workout.exercises.forEach((e, i) => {
      e.sort = i + 1;
    });
  } else if (!workout.comments) {
    realm.delete(workout);
  }
};

export const getExercisesByType = (type: string) =>
  realm
    .objects(WORKOUT_EXERCISE_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['date', true]]);

export const getRecentExercises = (date: string) => {
  const monthAgo = getTimeAgo(date, 'month', 1);
  return realm
    .objects(WORKOUT_EXERCISE_SCHEMA_NAME)
    .filtered('date >= $0 AND TRUEPREDICATE DISTINCT(type)', monthAgo);
};
