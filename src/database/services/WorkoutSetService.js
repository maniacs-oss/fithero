/* @flow */

import type { WorkoutSetSchemaType } from '../types';
import {
  ADD_SET,
  getSet,
  removeSet,
  UPDATE_SET,
} from '../../redux/modules/workouts';
import realm from '../index';
import { getExerciseSchemaIdFromSet } from '../utils';
import type { DispatchType } from '../../types';
import { deleteExercise } from './WorkoutExerciseService';
import { getFirstAndLastWeekday, getToday } from '../../utils/date';
import { WORKOUT_SET_SCHEMA_NAME } from '../schemas/WorkoutSetSchema';
import { WORKOUT_EXERCISE_SCHEMA_NAME } from '../schemas/WorkoutExerciseSchema';

export const getMaxSetByType = (type: string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['weight', true], 'date', 'id']);

export const addSet = (
  dispatch: (DispatchType<WorkoutSetSchemaType>) => void,
  set: WorkoutSetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(ADD_SET, set));

  realm.write(() => {
    const exerciseId = getExerciseSchemaIdFromSet(set.id);
    const exercise = realm.objectForPrimaryKey(
      WORKOUT_EXERCISE_SCHEMA_NAME,
      exerciseId
    );
    exercise.sets.push(set);
  });
};

export const updateSet = (
  dispatch: (DispatchType<WorkoutSetSchemaType>) => void,
  updatedSet: WorkoutSetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(UPDATE_SET, updatedSet));

  realm.write(() => {
    const set = realm.objectForPrimaryKey(
      WORKOUT_SET_SCHEMA_NAME,
      updatedSet.id
    );
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
    const setToDelete = realm.objectForPrimaryKey(
      WORKOUT_SET_SCHEMA_NAME,
      setId
    );
    realm.delete(setToDelete);
    // After deleting set, check if we need to delete the whole exercise
    const exerciseId = getExerciseSchemaIdFromSet(setId);
    const exercise = realm.objectForPrimaryKey(
      WORKOUT_EXERCISE_SCHEMA_NAME,
      exerciseId
    );
    if (exercise.sets.length === 0) {
      deleteExercise(exercise);
    }
  });
};

export const getLastSetByType = (type: ?string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['date', true], ['id', true]]);

export const getSetsThisWeek = () => {
  const [start, end] = getFirstAndLastWeekday(getToday());
  return realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered(`date >= $0 AND date <= $1`, start, end);
};
