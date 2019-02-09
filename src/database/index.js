/* @flow */

import Realm from 'realm';

import {
  WorkoutExerciseSchema,
  WorkoutSetSchema,
  WorkoutSchema,
  ExerciseSchema,
} from './schemas';

const realm = new Realm({
  schema: [
    WorkoutExerciseSchema,
    WorkoutSetSchema,
    WorkoutSchema,
    ExerciseSchema,
  ],
});

export default realm;
