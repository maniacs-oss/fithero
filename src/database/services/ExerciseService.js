/* @flow */

import leftPad from 'left-pad';

import realm from '../index';
import type { AddExerciseType, ExerciseSchemaType } from '../types';
import type { RealmResults } from '../../types';
import { EXERCISE_SCHEMA_NAME } from '../schemas/ExerciseSchema';

export const userExerciseIdPrefix = 'user-exercise--';

export const isCustomExercise = (id: string) =>
  id.includes(userExerciseIdPrefix);

const _generateId = () => {
  const exercises = realm.objects(EXERCISE_SCHEMA_NAME).sorted('id', true);
  let max = 1;
  if (exercises.length > 0) {
    max = parseInt(exercises[0].id.split(userExerciseIdPrefix)[1], 10) + 1;
  }
  // The user can create a max of 100000 exercises :)
  return `${userExerciseIdPrefix}${leftPad(max.toString(), 6, 0)}`;
};

export const addExercise = (exercise: AddExerciseType) => {
  realm.write(() => {
    const id = _generateId();

    realm.create(EXERCISE_SCHEMA_NAME, {
      id,
      ...exercise,
    });
  });
};

export const getAllExercises = (): RealmResults<ExerciseSchemaType> =>
  realm.objects(EXERCISE_SCHEMA_NAME);

export const getExerciseById = (id: string): RealmResults<ExerciseSchemaType> =>
  realm.objects(EXERCISE_SCHEMA_NAME).filtered(`id = $0`, id);
