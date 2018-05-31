/* @flow */

import realm from '../index';
import type { ExerciseSchemaType } from '../types';
import type { DispatchType } from '../../types';
import { extractWorkoutKeyFromDatabase } from '../utils';
import { toDate } from '../../utils/date';
import { getExercise } from '../../redux/modules/workouts';

export const addExercise = (
  dispatch: (fn: DispatchType<ExerciseSchemaType>) => void,
  exercise: ExerciseSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getExercise(exercise));

  realm.write(() => {
    const workoutId = extractWorkoutKeyFromDatabase(exercise.id);
    let workout = realm.objectForPrimaryKey('Workout', workoutId);
    if (!workout) {
      workout = realm.create('Workout', {
        id: workoutId,
        date: toDate(workoutId),
      });
    }
    workout.exercises.push(exercise);
  });
};
