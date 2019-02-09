/* @flow */

export type WorkoutSchemaType = {|
  id: string,
  date: Date,
  comments?: string,
  exercises: Array<WorkoutExerciseSchemaType>,
|};

export type WorkoutExerciseSchemaType = {|
  id: string,
  date: Date,
  type: string,
  sets: Array<WorkoutSetSchemaType>,
  comments?: string,
  sort: number,
|};

export type WorkoutSetSchemaType = {|
  id: string,
  date: Date,
  type: string,
  reps: number,
  weight: number,
|};

export type AddExerciseType = {|
  name?: string,
  notes?: string,
  primary: Array<string>,
  secondary?: ?Array<string>,
|};

export type ExerciseSchemaType = {|
  id: string,
|} & AddExerciseType;
