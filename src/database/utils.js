/* @flow */

import leftPad from 'left-pad';
import type { WorkoutSchemaType } from './types';

export const getExerciseSchemaId = (day: string, exerciseKey: string) =>
  `${day}_${exerciseKey}`;

export const getExerciseSchemaIdFromSet = (setId: string) => {
  const parts = setId.split('_');
  return `${parts[0]}_${parts[1]}`;
};

export const getSetSchemaId = (
  day: string,
  exerciseKey: string,
  index: number
) => `${getExerciseSchemaId(day, exerciseKey)}_${leftPad(index, 3, '0')}`;

export const extractWorkoutKeyFromDatabase = (id: string) => id.split('_')[0];

export const extractExerciseKeyFromDatabase = (id: string) => id.split('_')[1];

export const extractSetIndexFromDatabase = (id: string) =>
  parseInt(id.split('_')[2], 10);

// Parameter is in fact a Realm object
export const deserializeWorkout = (
  workout: WorkoutSchemaType
): WorkoutSchemaType => ({
  id: workout.id,
  date: workout.date,
  comments: workout.comments,
  exercises: Array.from(workout.exercises).map(e =>
    Object.assign({}, e, {
      sets: Array.from(e.sets).map(s => Object.assign({}, s)),
    })
  ),
});
