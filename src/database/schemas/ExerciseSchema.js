/* @flow */

const ExerciseSchema = {
  name: 'Exercise',
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    type: 'string',
    sets: { type: 'list', objectType: 'Set' },
    comments: { type: 'string', optional: true },
    sort: 'int',
  },
};

export default ExerciseSchema;
