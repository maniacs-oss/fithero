/* @flow */

import realm from './index';
import type { ExerciseSchemaType } from './types';

export const addExerciseForWorkout = (
  date: string,
  exercise: ExerciseSchemaType
) => {
  realm.write(() => {
    let workout = realm.objectForPrimaryKey('Workout', date);
    if (!workout) {
      workout = realm.create('Workout', {
        date,
      });
    }
    const existingExercises = workout.exercises.filtered(
      `id = "${exercise.id}"`
    );

    if (existingExercises.length === 0) {
      workout.exercises.push(exercise);
    } else {
      const existingSets = existingExercises[0].sets;

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

      existingExercises[0].comments = exercise.comments || null;
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
    }
  });
};
