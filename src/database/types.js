/* @flow */

export type WorkoutSchemaType = {|
  id: string,
  date: Date,
  comments?: string,
  exercises: Array<ExerciseSchemaType>,
|};

export type ExerciseSchemaType = {|
  id: string,
  sets: Array<{ id: string, reps: number, weight: number }>,
  comments?: string,
|};
