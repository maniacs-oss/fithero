/* @flow */

import leftPad from 'left-pad';

import type { ExerciseSchemaType, WorkoutSchemaType } from './types';
import type { RealmResults } from '../types';

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

export const deserializeWorkouts = (
  workouts: RealmResults<WorkoutSchemaType>
): Array<WorkoutSchemaType> => {
  return Object.values(JSON.parse(JSON.stringify(workouts))).map(w => {
    // $FlowFixMe
    let exercises = Object.values(w.exercises);
    const hasExercises = exercises.length > 0;
    if (hasExercises) {
      exercises.forEach(exercise => {
        // $FlowFixMe
        exercise.sets = Object.values(exercise.sets);
      });
    }
    return {
      ...w,
      exercises,
    };
  });
};

export const deserializeExercises = (
  exercises: RealmResults<ExerciseSchemaType>
): Array<ExerciseSchemaType> => {
  return Object.values(JSON.parse(JSON.stringify(exercises))).map(e => ({
    ...e,
    // $FlowFixMe
    primary: Object.values(e.primary),
    // $FlowFixMe
    secondary: Object.values(e.secondary),
  }));
};
