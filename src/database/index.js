/* @flow */

import Realm from 'realm';

import { ExerciseSchema, SetSchema, WorkoutSchema } from './schemas';

const realm = new Realm({
  schema: [ExerciseSchema, SetSchema, WorkoutSchema],
});

export default realm;
