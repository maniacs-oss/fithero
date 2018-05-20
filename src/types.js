/* @flow */

// Shared types

export type NavigationType = {
  push: (route: string) => void,
};

export type DispatchType<T> = {
  type: string,
  payload: T,
};

export type ExerciseType = {|
  id: string,
  category: string,
|};

export type ExerciseLog = {|
  sets: Array<{ reps: number, weight: number }>,
  comments?: string,
|};
