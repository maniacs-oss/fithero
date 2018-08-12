/* @flow */

import type { SetSchemaType } from '../types';
import {
  ADD_SET,
  getSet,
  removeSet,
  UPDATE_SET,
} from '../../redux/modules/workouts';
import realm from '../index';
import {
  extractWorkoutKeyFromDatabase,
  getExerciseSchemaIdFromSet,
} from '../utils';
import type { DispatchType } from '../../types';

export const getMaxSetByType = (type: string) =>
  realm
    .objects('Set')
    .filtered('type = $0', type)
    .sorted([['weight', true], 'date']);

export const addSet = (
  dispatch: (DispatchType<SetSchemaType>) => void,
  set: SetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(ADD_SET, set));

  realm.write(() => {
    const exerciseId = getExerciseSchemaIdFromSet(set.id);
    const exercise = realm.objectForPrimaryKey('Exercise', exerciseId);
    exercise.sets.push(set);
  });
};

export const updateSet = (
  dispatch: (DispatchType<SetSchemaType>) => void,
  updatedSet: SetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(UPDATE_SET, updatedSet));

  realm.write(() => {
    const set = realm.objectForPrimaryKey('Set', updatedSet.id);
    set.weight = updatedSet.weight;
    set.reps = updatedSet.reps;
  });
};

export const deleteSet = (
  dispatch: (DispatchType<string>) => void,
  setId: string
) => {
  // Optimistic update to Redux
  dispatch(removeSet(setId));

  // Database, if last set, delete exercise, if last exercise, delete workout
  realm.write(() => {
    const setToDelete = realm.objectForPrimaryKey('Set', setId);
    realm.delete(setToDelete);
    // After deleting set, check if we need to delete the whole exercise
    const exerciseId = getExerciseSchemaIdFromSet(setId);
    const exercise = realm.objectForPrimaryKey('Exercise', exerciseId);
    if (exercise.sets.length === 0) {
      realm.delete(exercise);
      // Now we check if workout needs to be deleted too
      const workoutId = extractWorkoutKeyFromDatabase(setId);
      const workout = realm.objectForPrimaryKey('Workout', workoutId);
      if (workout.exercises.length === 0) {
        realm.delete(workout);
      }
    }
  });
};
