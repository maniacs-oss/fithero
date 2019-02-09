/* @flow */

import { WORKOUT_EXERCISE_SCHEMA_NAME } from './WorkoutExerciseSchema';

export const WORKOUT_SCHEMA_NAME = 'Workout';

const WorkoutSchema = {
  name: WORKOUT_SCHEMA_NAME,
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    exercises: { type: 'list', objectType: WORKOUT_EXERCISE_SCHEMA_NAME },
    comments: { type: 'string', optional: true },
  },
};

export default WorkoutSchema;
