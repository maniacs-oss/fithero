/* @flow */

// Shared types

export type NavigationType = {
  push: (route: string) => void,
};

export type ExerciseType = {|
  id: string,
  category: string,
|};
