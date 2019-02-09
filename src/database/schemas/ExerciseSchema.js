/* @flow */

export const EXERCISE_SCHEMA_NAME = 'Exercise';

const ExerciseSchema = {
  name: EXERCISE_SCHEMA_NAME,
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', optional: true },
    notes: { type: 'string', optional: true },
    primary: 'string[]',
    secondary: { type: 'string[]', optional: true },
  },
};

export default ExerciseSchema;
