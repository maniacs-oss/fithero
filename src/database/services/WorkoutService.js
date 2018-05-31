/* @flow */

import realm from '../index';

import type { ExerciseSchemaType, WorkoutSchemaType } from '../types';
import type { DispatchType } from '../../types';
import { getWorkouts } from '../../redux/modules/workouts';
import { dateToString } from '../../utils/date';
import { deserializeWorkout } from '../utils';

export const getWorkoutsByRange = (
  dispatch: (fn: DispatchType<Array<WorkoutSchemaType>>) => void,
  startDate: Date,
  endDate: Date
) => {
  const workouts = realm
    .objects('Workout')
    .filtered(`date >= $0 AND date <= $1`, startDate, endDate);

  dispatch(getWorkouts(workouts.map(w => deserializeWorkout(w))));
};

export const addExercisePaperForWorkout = (
  dispatch: (fn: DispatchType<Array<WorkoutSchemaType>>) => void,
  date: Date,
  exercise: ExerciseSchemaType
) => {
  realm.write(() => {
    const workoutId = dateToString(date);
    let workout = realm.objectForPrimaryKey('Workout', workoutId);
    if (!workout) {
      workout = realm.create('Workout', {
        id: workoutId,
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

    // TODO do it in redux before Realm
    dispatch(getWorkouts([deserializeWorkout(workout)]));
  });
};
