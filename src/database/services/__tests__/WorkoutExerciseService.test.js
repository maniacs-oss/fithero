/* @flow */

import { addExercise, deleteWorkoutExercise } from '../WorkoutExerciseService';
import realm from '../../index';
import {
  mockRealmWorkout,
  mockWorkouts,
  getMockExercises,
  mockSets,
} from './helpers/databaseMocks';

jest.mock('realm');

const mockExercise = getMockExercises(mockSets)[0];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addExercise', () => {
  it('creates a workout if it does not exist', () => {
    realm.create = jest.fn(() => mockRealmWorkout);
    realm.objectForPrimaryKey = jest.fn(() => null);

    addExercise(mockExercise);

    expect(realm.create).toHaveBeenCalledTimes(1);
    expect(realm.create).toHaveBeenCalledWith('Workout', {
      id: mockRealmWorkout.id,
      date: mockRealmWorkout.date,
    });

    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledWith(mockExercise);
  });

  it('pushes the new exercise directly into a existing workout', () => {
    realm.objectForPrimaryKey = jest.fn(() => mockRealmWorkout);

    addExercise(mockExercise);

    expect(realm.create).toHaveBeenCalledTimes(0);

    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
    expect(mockRealmWorkout.exercises.push).toHaveBeenCalledWith(mockExercise);
  });
});

describe('deleteWorkoutExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes an exercise', () => {
    // Mock it to return a workout that still has exercises
    realm.objectForPrimaryKey = jest.fn(() => mockWorkouts[0]);
    deleteWorkoutExercise(mockExercise);
    expect(realm.delete).toHaveBeenCalledTimes(1);
    expect(realm.delete).toHaveBeenCalledWith(mockExercise);
  });

  it('deletes the last exercise and the workout', () => {
    // Mock it to return a workout with empty exercises
    realm.objectForPrimaryKey = jest.fn(() => mockWorkouts[1]);
    deleteWorkoutExercise(mockExercise);
    expect(realm.delete).toHaveBeenCalledTimes(2);
    expect(realm.delete).toHaveBeenCalledWith(mockExercise);
    expect(realm.delete).toHaveBeenCalledWith(mockWorkouts[1]);
  });

  it('deletes the last exercise but not the workout if it has comments', () => {
    realm.objectForPrimaryKey = jest.fn(() => ({
      ...mockWorkouts[1],
      comments: 'This was was hard!',
    }));
    deleteWorkoutExercise(mockExercise);
    expect(realm.delete).toHaveBeenCalledTimes(1);
    expect(realm.delete).toHaveBeenCalledWith(mockExercise);
  });

  // TODO
  it.skip('deletes an exercise and change the order of the others', () => {});
});
