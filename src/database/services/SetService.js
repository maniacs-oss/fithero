/* @flow */

import type { SetSchemaType } from '../types';
import { ADD_SET, getSet, UPDATE_SET } from '../../redux/modules/workouts';
import realm from '../index';
import { getExerciseSchemaIdFromSet } from '../utils';
import type { DispatchType } from '../../types';

export const addSet = (
  dispatch: (DispatchType<SetSchemaType>) => void,
  set: SetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(ADD_SET, set));

  realm.write(() => {
    const exerciseId = getExerciseSchemaIdFromSet(set);
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
