/* @flow */

const WorkoutSchema = {
  name: 'Workout',
  primaryKey: 'date',
  properties: {
    date: 'string',
    exercises: { type: 'list', objectType: 'Exercise' },
    comments: { type: 'string', optional: true },
  },
};

export default WorkoutSchema;
