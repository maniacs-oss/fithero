/* @flow */

import leftPad from 'left-pad';

import { addExercise, userExerciseIdPrefix } from '../ExerciseService';
import realm from '../../index';
import { EXERCISE_SCHEMA_NAME } from '../../schemas/ExerciseSchema';

describe('addExercise', () => {
  let current = 0;
  realm.objects = jest.fn(() => ({
    sorted: jest.fn(() => {
      const exercise = [
        {
          id: `${userExerciseIdPrefix}${leftPad(current.toString(), 6, 0)}`,
          name: 'Existing exercise',
        },
      ];
      current++;
      return exercise;
    }),
  }));

  it('calls addExercise with correct data and generated id', () => {
    const exercise = {
      name: 'TestExercise',
      notes: 'Very hard!',
      primary: ['Chest'],
    };

    const generated = [...Array(102)].map((_, i) => leftPad(i + 1, 6, 0));
    generated.forEach(g => {
      addExercise(exercise);
      expect(realm.create).toBeCalledWith(EXERCISE_SCHEMA_NAME, {
        id: `${userExerciseIdPrefix}${g}`,
        ...exercise,
      });
    });
  });
});
