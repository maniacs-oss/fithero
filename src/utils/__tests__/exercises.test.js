/* @flow */

import { searchExerciseByName } from '../exercises';

test('searchExerciseByName', () => {
  expect(searchExerciseByName('Deadlift', 'Dead Lifts: Barbell')).toEqual(true);
  expect(
    searchExerciseByName('Biceps barbell', 'Biceps Curl: Barbell')
  ).toEqual(true);
  expect(
    searchExerciseByName('Barbell row', 'Bent Over Row with Barbell')
  ).toEqual(true);
  expect(
    searchExerciseByName('row barbell', 'Bent Over Row with Barbell')
  ).toEqual(true);
  expect(searchExerciseByName('Face pull', 'Face Pull')).toEqual(true);
  expect(searchExerciseByName('Facepull', 'Face Pull')).toEqual(true);
  expect(searchExerciseByName('dumbbell', 'Biceps Curl: Dumbbell')).toEqual(
    true
  );
  expect(searchExerciseByName('curl biceps', 'Biceps Curl: Dumbbell')).toEqual(
    true
  );
  expect(searchExerciseByName('Wheel', 'Ab Wheel Rollout')).toEqual(true);
  expect(
    searchExerciseByName(
      'Bench Press: Barbell (Decline)',
      'Bench Press: Barbell (Decline)'
    )
  ).toEqual(true);

  expect(
    searchExerciseByName('Biceps barbell', 'Biceps Curl: Dumbbell')
  ).toEqual(false);
});
