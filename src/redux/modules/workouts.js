/* @flow */

import type {
  ExerciseSchemaType,
  SetSchemaType,
  WorkoutSchemaType,
} from '../../database/types';
import {
  extractWorkoutKeyFromDatabase,
  getExerciseSchemaIdFromSet,
} from '../../database/utils';
import { toDate } from '../../utils/date';

export const GET_WORKOUT = 'dziku/workouts/GET_WORKOUT';
export const ADD_SET = 'dziku/workouts/ADD_SET';
export const ADD_EXERCISE = 'dziku/workouts/ADD_EXERCISE';
export const UPDATE_SET = 'dziku/workouts/UPDATE_SET';
export const REMOVE_SET = 'dziku/workouts/REMOVE_SET';

type State = { [date: string]: WorkoutSchemaType };
type Action =
  | { type: typeof GET_WORKOUT, payload: Array<WorkoutSchemaType> }
  | { type: typeof ADD_EXERCISE, payload: ExerciseSchemaType }
  | { type: typeof ADD_SET, payload: SetSchemaType }
  | { type: typeof UPDATE_SET, payload: SetSchemaType }
  | { type: typeof REMOVE_SET, payload: string };

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case GET_WORKOUT: {
      const workouts = action.payload.reduce(
        (obj, item) => ({ ...obj, [item.id]: item }),
        {}
      );
      return { ...state, ...workouts };
    }
    case ADD_EXERCISE: {
      const exercise: ExerciseSchemaType = action.payload;
      const workoutId = extractWorkoutKeyFromDatabase(exercise.id);
      const workout = state[workoutId];
      let newWorkout;

      if (!workout) {
        // Creating the workout for this day for the first time
        newWorkout = {
          id: workoutId,
          date: toDate(workoutId),
          exercises: [exercise],
        };
      } else {
        // Add exercise (first set) to existing workout
        newWorkout = {
          ...workout,
          ...{ exercises: workout.exercises.concat([exercise]) },
        };
      }
      return { ...state, [newWorkout.id]: newWorkout };
    }
    case ADD_SET: {
      const set: SetSchemaType = action.payload;
      const workout = state[extractWorkoutKeyFromDatabase(set.id)];
      const exerciseId = getExerciseSchemaIdFromSet(set.id);
      const newExercises = workout.exercises.map(e => {
        if (e.id !== exerciseId) {
          return e;
        }
        return {
          ...e,
          sets: e.sets.concat(set),
        };
      });
      const newWorkout = { ...workout, ...{ exercises: newExercises } };
      return { ...state, [workout.id]: newWorkout };
    }
    case UPDATE_SET: {
      const set: SetSchemaType = action.payload;
      const workout = state[extractWorkoutKeyFromDatabase(set.id)];
      const exerciseId = getExerciseSchemaIdFromSet(set.id);
      const newExercises = workout.exercises.map(e => {
        if (e.id !== exerciseId) {
          return e;
        }
        return {
          ...e,
          sets: e.sets.map(s => {
            if (s.id !== set.id) {
              return s;
            }
            return set;
          }),
        };
      });
      const newWorkout = { ...workout, ...{ exercises: newExercises } };
      return { ...state, [workout.id]: newWorkout };
    }
    case REMOVE_SET: {
      const setId: string = action.payload;
      const workoutId = extractWorkoutKeyFromDatabase(setId);
      const workout = state[workoutId];
      const exerciseId = getExerciseSchemaIdFromSet(setId);
      const exercise = workout.exercises.find(e => e.id === exerciseId);

      // Just for Flow
      if (exercise) {
        const newExercise = {
          ...exercise,
          ...{ sets: exercise.sets.filter(s => s.id !== setId) },
        };

        let newWorkout = {};
        if (newExercise.sets.length > 0) {
          // Merge exercise
          const newExercises = workout.exercises.map(e => {
            if (e.id === exerciseId) {
              return newExercise;
            }
            return e;
          });
          newWorkout = { ...workout, ...{ exercises: newExercises } };
          return { ...state, [workout.id]: newWorkout };
        }
        const newExercises = workout.exercises.filter(e => e.id !== exerciseId);
        if (newExercises.length > 0) {
          // Remove exercise from workout
          newWorkout = { ...workout, ...{ exercises: newExercises } };
          return { ...state, [workout.id]: newWorkout };
        }
        // Remove whole workout
        const { [workoutId]: _, ...rest } = state;
        return rest;
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

export const getWorkouts = (workouts: Array<WorkoutSchemaType>) => ({
  type: GET_WORKOUT,
  payload: workouts,
});

export const getExercise = (exercise: ExerciseSchemaType) => ({
  type: ADD_EXERCISE,
  payload: exercise,
});

export const getSet = (
  type: typeof ADD_SET | typeof UPDATE_SET,
  set: SetSchemaType
) => ({
  type,
  payload: set,
});

export const removeSet = (setId: string) => ({
  type: REMOVE_SET,
  payload: setId,
});
