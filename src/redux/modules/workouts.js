/* @flow */

import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
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
export const UPDATE_EXERCISE = 'dziku/workouts/UPDATE_EXERCISE';

type State = { [date: string]: WorkoutSchemaType };
type Action =
  | { type: typeof GET_WORKOUT, payload: Array<WorkoutSchemaType> }
  | { type: typeof ADD_EXERCISE, payload: WorkoutExerciseSchemaType }
  | { type: typeof ADD_SET, payload: WorkoutSetSchemaType }
  | { type: typeof UPDATE_SET, payload: WorkoutSetSchemaType }
  | { type: typeof REMOVE_SET, payload: string }
  | { type: typeof UPDATE_EXERCISE, payload: WorkoutExerciseSchemaType };

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
      const exercise: WorkoutExerciseSchemaType = action.payload;
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
          exercises: workout.exercises.concat([exercise]),
        };
      }
      return { ...state, [newWorkout.id]: newWorkout };
    }
    case ADD_SET: {
      const set: WorkoutSetSchemaType = action.payload;
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
      const newWorkout = { ...workout, exercises: newExercises };
      return { ...state, [workout.id]: newWorkout };
    }
    case UPDATE_SET: {
      const set: WorkoutSetSchemaType = action.payload;
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
      const newWorkout = { ...workout, exercises: newExercises };
      return { ...state, [workout.id]: newWorkout };
    }
    case REMOVE_SET: {
      const setId: string = action.payload;
      const workoutId = extractWorkoutKeyFromDatabase(setId);
      const workout = state[workoutId];
      const exerciseId = getExerciseSchemaIdFromSet(setId);
      const exercise = workout.exercises.find(e => e.id === exerciseId);

      const newExercise = {
        ...exercise,
        // $FlowFixMe we always have an exercise here, if not we wouldn't be able to delete it
        sets: exercise.sets.filter(s => s.id !== setId),
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
        newWorkout = { ...workout, exercises: newExercises };
        return { ...state, [workout.id]: newWorkout };
      }
      const newExercises = workout.exercises.filter(e => e.id !== exerciseId);
      if (newExercises.length > 0) {
        // Remove exercise from workout
        newWorkout = {
          ...workout,
          ...{
            // Fix sort of exercises after deleting one
            exercises: newExercises.map((e, i) => ({
              ...e,
              sort: i + 1,
            })),
          },
        };
        return { ...state, [workout.id]: newWorkout };
      }
      // Remove whole workout
      const { [workoutId]: _, ...rest } = state;
      return rest;
    }
    case UPDATE_EXERCISE: {
      const exercise: WorkoutExerciseSchemaType = action.payload;
      const workout = state[extractWorkoutKeyFromDatabase(exercise.id)];
      if (exercise.sets.length > 0) {
        const newExercises = workout.exercises.map(
          e => (e.id !== exercise.id ? e : exercise)
        );
        const newWorkout = { ...workout, exercises: newExercises };
        return { ...state, [workout.id]: newWorkout };
      }
      const newExercises = workout.exercises.filter(e => e.id !== exercise.id);
      if (newExercises.length === 0) {
        // Delete the whole workout
        const { [workout.id]: _, ...rest } = state;
        return rest;
      }
      // Delete just the exercise from the workout
      const newWorkout = { ...workout, exercises: newExercises };
      return { ...state, [workout.id]: newWorkout };
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

export const getExercise = (exercise: WorkoutExerciseSchemaType) => ({
  type: ADD_EXERCISE,
  payload: exercise,
});

export const getSet = (
  type: typeof ADD_SET | typeof UPDATE_SET,
  set: WorkoutSetSchemaType
) => ({
  type,
  payload: set,
});

export const removeSet = (setId: string) => ({
  type: REMOVE_SET,
  payload: setId,
});

export const updateExercise = (exercise: WorkoutExerciseSchemaType) => ({
  type: UPDATE_EXERCISE,
  payload: exercise,
});
