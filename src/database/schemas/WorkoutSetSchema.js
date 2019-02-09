/* @flow */

export const WORKOUT_SET_SCHEMA_NAME = 'WorkoutSet';

const WorkoutSetSchema = {
  name: WORKOUT_SET_SCHEMA_NAME,
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    type: 'string',
    reps: 'int',
    weight: { type: 'float', optional: true },
  },
};

export default WorkoutSetSchema;
