/* @flow */

import realm from '../../index';
import { addSet, updateSet } from '../SetService';
import { ADD_SET, getSet, UPDATE_SET } from '../../../redux/modules/workouts';

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
