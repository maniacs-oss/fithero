/* @flow */

const ExerciseSchema = {
  name: 'Exercise',
  primaryKey: 'id',
  properties: {
    id: 'string',
    sets: { type: 'list', objectType: 'Set' },
    comments: { type: 'string', optional: true },
  },
};

export default ExerciseSchema;
