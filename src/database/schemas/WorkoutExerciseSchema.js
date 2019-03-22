/* @flow */

import { WORKOUT_SET_SCHEMA_NAME } from './WorkoutSetSchema';

export const WORKOUT_EXERCISE_SCHEMA_NAME = 'WorkoutExercise';

const WorkoutExerciseSchema = {
  name: WORKOUT_EXERCISE_SCHEMA_NAME,
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    type: 'string',
    sets: { type: 'list', objectType: WORKOUT_SET_SCHEMA_NAME },
    sort: 'int',
    weight_unit: { type: 'string', optional: true },
  },
};

export default WorkoutExerciseSchema;
