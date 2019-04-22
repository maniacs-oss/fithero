/* @flow */

import realm from '../index';
import type { AddWorkoutExerciseSchemaType } from '../types';
import { dateToWorkoutId } from '../../utils/date';
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

export const updateExercisePaperForWorkout = (
  exercise: AddWorkoutExerciseSchemaType
) => {
  realm.write(() => {
    const workoutId = dateToWorkoutId(exercise.date);
    const workout = realm.objectForPrimaryKey(WORKOUT_SCHEMA_NAME, workoutId);
    const existingExercise = workout.exercises.filtered(
      `id = "${exercise.id}"`
    )[0];
    const existingSets = existingExercise.sets;

    // Check for sets that have been deleted first
    const setsToDelete = [];
    existingSets.forEach(existingSet => {
      const set = exercise.sets.find(s => s.id === existingSet.id);
      if (!set) {
        setsToDelete.push(existingSet);
      }
    });

    if (setsToDelete.length > 0) {
      realm.delete(setsToDelete);
    }

    if (exercise.sets.length > 0) {
      exercise.sets.forEach(s => {
        const set = existingSets.filtered(`id = "${s.id}"`)[0];
        if (set) {
          // Update set
          set.reps = s.reps;
          set.weight = s.weight;
        } else {
          // Add new set
          existingSets.push(s);
        }
      });
    } else {
      // Delete exercise
      deleteWorkoutExercise(existingExercise);
    }
  });
};

export const getExercisesByType = (type: string) =>
  realm
    .objects(WORKOUT_EXERCISE_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['date', true]]);
