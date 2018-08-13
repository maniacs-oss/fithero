/* @flow */

export type WorkoutSchemaType = {|
  id: string,
  date: Date,
  comments?: string,
  exercises: Array<ExerciseSchemaType>,
|};

export type ExerciseSchemaType = {|
  id: string,
  date: Date,
  type: string,
  sets: Array<SetSchemaType>,
  comments?: string,
  sort: number,
|};

export type SetSchemaType = {|
  id: string,
  date: Date,
  type: string,
  reps: number,
  weight: number,
|};
