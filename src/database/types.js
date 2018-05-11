/* @flow */

export type ExerciseSchemaType = {|
  id: string,
  sets: Array<{ id: string, reps: number, weight: number }>,
  comments?: string,
|};
