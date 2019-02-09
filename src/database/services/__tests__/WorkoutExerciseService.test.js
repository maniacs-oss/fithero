/* @flow */

import {
  addExercise,
  deleteExercise,
  updateExercisePaperForWorkout,
} from '../WorkoutExerciseService';
import realm from '../../index';
import { getExercise } from '../../../redux/modules/workouts';
import {
  RealmArray,
  dates,
  mockRealmWorkout,
  mockWorkouts,
  getMockExercises,
  mockSets,
  mockMultipleSets,
} from './helpers/databaseMocks';

jest.mock('realm');

const dispatch = jest.fn();
const mockExercise = getMockExercises(mockSets)[0];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addExercise', () => {
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

describe('deleteExercise', () => {
  it('deletes an exercise', () => {
    // Mock it to return a workout that still has exercises
    realm.objectForPrimaryKey = jest.fn(() => mockWorkouts[0]);
    deleteExercise(mockExercise);
    expect(realm.delete).toHaveBeenCalledTimes(1);
    expect(realm.delete).toHaveBeenCalledWith(mockExercise);
  });
  it('deletes an exercise and the workout', () => {
    // Mock it to return a workout with empty exercises
    realm.objectForPrimaryKey = jest.fn(() => mockWorkouts[1]);
    deleteExercise(mockExercise);
    expect(realm.delete).toHaveBeenCalledTimes(2);
    expect(realm.delete).toHaveBeenCalledWith(mockExercise);
  });
  // TODO
  it.skip('deletes an exercise and change the order of the others', () => {});
});

describe('updateExercisePaperForWorkout', () => {
  it('updates an exercise correctly', () => {
    const mockNewRealmWorkout = {
      ...mockRealmWorkout,
      exercises: getMockExercises(mockSets),
    };

    realm.objectForPrimaryKey = jest.fn(() => mockNewRealmWorkout);

    const mutatedExercise = {
      id: mockExercise.id,
      comments: 'New comment!',
      sets: mockSets,
      date: dates[0].date,
      type: mockExercise.type,
      sort: 1,
    };

    // $FlowFixMe Hard to type this way of mocking RealmArray for tests
    updateExercisePaperForWorkout(dispatch, mutatedExercise);

    expect(mutatedExercise.comments).toEqual('New comment!');
    expect(mockSets.push).toHaveBeenCalledTimes(0);
    expect(realm.delete).not.toBeCalled();
  });

  it('adds a new set correctly', () => {
    const mockNewRealmWorkout = {
      ...mockRealmWorkout,
      exercises: getMockExercises(mockSets),
    };

    realm.objectForPrimaryKey = jest.fn(() => mockNewRealmWorkout);

    const mutatedExercise = {
      id: mockExercise.id,
      sets: mockMultipleSets,
      date: dates[0].date,
      type: mockExercise.type,
      sort: 1,
    };

    // $FlowFixMe Hard to type this way of mocking RealmArray for tests
    updateExercisePaperForWorkout(dispatch, mutatedExercise);

    expect(mutatedExercise.sets).toHaveLength(2);
    expect(mockSets.push).toHaveBeenCalledTimes(1);
    expect(realm.delete).not.toBeCalled();
  });

  it('deletes the set and the whole exercise', () => {
    const mockNewRealmWorkout = {
      ...mockRealmWorkout,
      exercises: getMockExercises(mockSets),
    };

    realm.objectForPrimaryKey = jest.fn(() => mockNewRealmWorkout);

    const mutatedExercise = {
      id: mockExercise.id,
      sets: new RealmArray(),
      date: dates[0].date,
      type: mockExercise.type,
      sort: 1,
    };

    // $FlowFixMe Hard to type this way of mocking RealmArray for tests
    updateExercisePaperForWorkout(dispatch, mutatedExercise);

    expect(mockSets.push).toHaveBeenCalledTimes(0);
    expect(realm.delete).toHaveBeenCalledTimes(2);
    // $FlowFixMe figure out what is going on with toHaveBeenNthCalledWith
    expect(realm.delete).toHaveBeenNthCalledWith(1, [mockSets[0]]);
    // $FlowFixMe figure out what is going on with toHaveBeenNthCalledWith
    expect(realm.delete).toHaveBeenNthCalledWith(
      2,
      mockNewRealmWorkout.exercises[0]
    );
  });
});
