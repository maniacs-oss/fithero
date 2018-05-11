/* @flow */

const SetSchema = {
  name: 'Set',
  primaryKey: 'id',
  properties: {
    id: 'string',
    reps: 'int',
    weight: { type: 'float', optional: true },
  },
};

export default SetSchema;
