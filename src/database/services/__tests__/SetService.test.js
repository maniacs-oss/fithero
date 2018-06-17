/* @flow */

import realm from '../../index';
import { addSet, deleteSet, updateSet } from '../SetService';
import {
  ADD_SET,
  getSet,
  removeSet,
  UPDATE_SET,
} from '../../../redux/modules/workouts';

jest.mock('realm');

const dispatch = jest.fn();

const mockRealmExercise = {
  id: '2018-05-04T00:00:00.000Z_bench-press',
  comments: '',
  sets: {
    push: jest.fn(),
  },
};

const mockSet = {
  id: '2018-05-04T00:00:00.000Z_bench-press_001',
  reps: 8,
  weight: 75,
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('addSet', () => {
  realm.objectForPrimaryKey = jest.fn(() => mockRealmExercise);
  addSet(dispatch, mockSet);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toBeCalledWith(getSet(ADD_SET, mockSet));

  expect(mockRealmExercise.sets.push).toHaveBeenCalledTimes(1);
  expect(mockRealmExercise.sets.push).toBeCalledWith(mockSet);
});

test('updateSet', () => {
  const toBeMutatedByRealmSet = {
    id: '2018-05-04T00:00:00.000Z_bench-press_001',
    reps: 7,
    weight: 70,
  };
  realm.objectForPrimaryKey = jest.fn(() => toBeMutatedByRealmSet);

  updateSet(dispatch, mockSet);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toBeCalledWith(getSet(UPDATE_SET, mockSet));

  expect(toBeMutatedByRealmSet).toEqual(mockSet);
});

describe('deleteSet', () => {
  const set = {
    id: '2018-05-04T00:00:00.000Z_bench-press_001',
    reps: 7,
    weight: 70,
  };

  const secondSet = {
    id: '2018-05-04T00:00:00.000Z_bench-press_002',
    reps: 5,
    weight: 70,
  };

  const exercise = {
    id: '2018-05-04T00:00:00.000Z_bench-press',
    sets: [],
  };

  it('deletes only the set', () => {
    realm.objectForPrimaryKey = jest.fn(name => {
      if (name === 'Set') {
        return set;
      } else if (name === 'Exercise') {
        return { sets: [secondSet] };
      }
      return null;
    });

    deleteSet(dispatch, set.id);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(removeSet(set.id));

    expect(realm.delete).toHaveBeenCalledTimes(1);
    expect(realm.delete).toBeCalledWith(set);
  });

  it('deletes the set and the exercise', () => {
    realm.objectForPrimaryKey = jest.fn(name => {
      if (name === 'Set') {
        return set;
      } else if (name === 'Exercise') {
        return exercise;
      } else if (name === 'Workout') {
        return { exercises: mockRealmExercise };
      }
      return null;
    });

    deleteSet(dispatch, set.id);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(removeSet(set.id));

    expect(realm.delete).toHaveBeenCalledTimes(2);
    expect(realm.delete).toBeCalledWith(set);
    expect(realm.delete).toBeCalledWith(exercise);
  });

  it('deletes the set, the exercise and the workout', () => {
    const workout = {
      id: '2018-05-04T00:00:00.000Z_bench-press',
      exercises: [],
    };

    realm.objectForPrimaryKey = jest.fn(name => {
      if (name === 'Set') {
        return set;
      } else if (name === 'Exercise') {
        return exercise;
      } else if (name === 'Workout') {
        return workout;
      }
      return null;
    });

    deleteSet(dispatch, set.id);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(removeSet(set.id));

    expect(realm.delete).toHaveBeenCalledTimes(3);
    expect(realm.delete).toBeCalledWith(set);
    expect(realm.delete).toBeCalledWith(exercise);
    expect(realm.delete).toBeCalledWith(workout);
  });
});
