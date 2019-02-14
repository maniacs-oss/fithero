/* @flow */

import leftPad from 'left-pad';

import realm from '../index';
import type { AddExerciseType, ExerciseSchemaType } from '../types';
import type { RealmResults } from '../../types';
import { EXERCISE_SCHEMA_NAME } from '../schemas/ExerciseSchema';
import { WORKOUT_EXERCISE_SCHEMA_NAME } from '../schemas/WorkoutExerciseSchema';
import { WORKOUT_SET_SCHEMA_NAME } from '../schemas/WorkoutSetSchema';
import { WORKOUT_SCHEMA_NAME } from '../schemas/WorkoutSchema';

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

export const editExercise = (newExercise: ExerciseSchemaType) => {
  realm.write(() => {
    const exercise = realm.objectForPrimaryKey(
      EXERCISE_SCHEMA_NAME,
      newExercise.id
    );
    exercise.name = newExercise.name;
    exercise.notes = newExercise.notes || null;
    exercise.primary = newExercise.primary;
    exercise.secondary = newExercise.secondary;
  });
};

export const getAllExercises = (): RealmResults<ExerciseSchemaType> =>
  realm.objects(EXERCISE_SCHEMA_NAME);

export const getExerciseById = (id: string): RealmResults<ExerciseSchemaType> =>
  realm.objects(EXERCISE_SCHEMA_NAME).filtered(`id = $0`, id);

export const deleteExercise = (id: string) => {
  realm.write(() => {
    const workoutExercises = realm
      .objects(WORKOUT_EXERCISE_SCHEMA_NAME)
      .filtered(`type = $0`, id);

    const workoutExerciseSets = realm
      .objects(WORKOUT_SET_SCHEMA_NAME)
      .filtered(`type = $0`, id);

    // We first need to delete any exercise referenced that is part of a workout
    realm.delete(workoutExerciseSets);
    realm.delete(workoutExercises);

    // Clear workouts if necessary
    const emptyWorkouts = realm
      .objects(WORKOUT_SCHEMA_NAME)
      .filtered('exercises.@size = 0');

    realm.delete(emptyWorkouts);

    // Finally when no references, delete the exercise
    const exercise: ExerciseSchemaType = realm.objectForPrimaryKey(
      EXERCISE_SCHEMA_NAME,
      id
    );
    realm.delete(exercise);
  });
};
