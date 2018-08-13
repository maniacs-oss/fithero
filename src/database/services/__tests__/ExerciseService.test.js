/* @flow */

import { addExercise } from '../ExerciseService';
import realm from '../../index';
import { toDate } from '../../../utils/date';
import { getExercise } from '../../../redux/modules/workouts';

jest.mock('realm');

const date = toDate('2018-05-04T00:00:00.000Z');

describe('addExercise', () => {
  const dispatch = jest.fn();
  const mockRealmWorkout = {
    id: '2018-05-04T00:00:00.000Z',
    date,
    exercises: {
      push: jest.fn(),
    },
  };
  const mockExercise = {
    id: '2018-05-04T00:00:00.000Z_bench-press',
    sets: [
      {
        id: '2018-05-04T00:00:00.000Z_bench-press_001',
        reps: 18,
        weight: 100,
        date,
        type: 'bench-press',
      },
    ],
    date,
    type: 'bench-press',
    sort: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a workout if it does not exist', () => {
    realm.create = jest.fn(() => mockRealmWorkout);
    realm.objectForPrimaryKey = jest.fn(() => null);

    addExercise(dispatch, mockExercise);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(getExercise(mockExercise));

    expect(realm.create).toHaveBeenCalledTimes(1);
    expect(realm.create).toBeCalledWith('Workout', {
      id: mockRealmWorkout.id,
      date: mockRealmWorkout.date,
    });

    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
    expect(mockRealmWorkout.exercises.push).toBeCalledWith(mockExercise);
  });

  it('pushes the new exercise directly into a existing workout', () => {
    realm.objectForPrimaryKey = jest.fn(() => mockRealmWorkout);

    addExercise(dispatch, mockExercise);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(getExercise(mockExercise));

    expect(realm.create).toHaveBeenCalledTimes(0);

    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
    expect(mockRealmWorkout.exercises.push).toBeCalledWith(mockExercise);
  });
});
