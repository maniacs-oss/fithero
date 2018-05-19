/* @flow */

const WorkoutSchema = {
  name: 'Workout',
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    exercises: { type: 'list', objectType: 'Exercise' },
    comments: { type: 'string', optional: true },
  },
};

export default WorkoutSchema;
