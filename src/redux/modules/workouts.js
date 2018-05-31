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

type State = { [date: string]: WorkoutSchemaType };
type Action =
  | { type: typeof GET_WORKOUT, payload: Array<WorkoutSchemaType> }
  | { type: typeof ADD_EXERCISE, payload: ExerciseSchemaType }
  | { type: typeof ADD_SET, payload: SetSchemaType }
  | { type: typeof UPDATE_SET, payload: SetSchemaType };

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
      const exerciseId = getExerciseSchemaIdFromSet(set);
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
      const exerciseId = getExerciseSchemaIdFromSet(set);
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
