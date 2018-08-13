/* @flow */

import realm from '../../index';
import {
  addExercisePaperForWorkout,
  getWorkout,
  getWorkoutsByRange,
} from '../WorkoutService';
import { toDate } from '../../../utils/date';
import { GET_WORKOUT } from '../../../redux/modules/workouts';

jest.mock('realm');

const date = toDate('2018-05-04T00:00:00.000Z');

const mockSets = [
  {
    id: '2018-05-04T00:00:00.000Z_bench-press_001',
    reps: 18,
    weight: 100,
    date,
    type: 'bench-press',
  },
  {
    id: '2018-05-04T00:00:00.000Z_bench-press_002',
    reps: 7,
    weight: 105.5,
    date,
    type: 'bench-press',
  },
];

const mockExercise = {
  id: '2018-05-04T00:00:00.000Z_bench-press',
  sets: [mockSets],
  date,
  type: 'bench-press',
  sort: 1,
};

const mockRealmExercise = {
  id: mockExercise.id,
  sets: {
    filtered: () => mockSets,
    forEach: Array.prototype.forEach,
  },
  type: mockExercise.type,
  sort: 1,
};

const mockWorkout = {
  id: '2018-05-04T00:00:00.000Z',
  date,
  exercises: [],
};

const mockRealmWorkout = {
  id: mockWorkout.id,
  date: mockWorkout.date,
  exercises: {
    filtered: () => [],
    push: jest.fn(),
  },
};

describe('WorkoutService', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    realm.create = jest.fn(() => mockRealmWorkout);
    jest.clearAllMocks();
  });

  describe('getWorkoutsByRange', () => {
    it('dispatches an action when getting workouts', () => {
      realm.objects = jest.fn(() => ({
        filtered: jest.fn(() => [mockRealmWorkout]),
      }));

      getWorkoutsByRange(dispatch, date, date);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });
  });

  describe('getWorkout', () => {
    it('does not dispatch an action if there is no workout', () => {
      realm.objects = jest.fn(() => ({
        filtered: jest.fn(() => []),
      }));

      getWorkout(dispatch, toDate('2018-06-23T00:00:00.000Z'));

      expect(dispatch).not.toBeCalled();
    });

    it('dispatch an action if there is a workout', () => {
      realm.objects = jest.fn(() => ({
        filtered: jest.fn(() => [mockRealmWorkout]),
      }));

      getWorkout(dispatch, toDate('2018-06-23T00:00:00.000Z'));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });
  });

  describe('addExercisePaperForWorkout', () => {
    it('adds a workout if it is not there yet', () => {
      addExercisePaperForWorkout(dispatch, date, {
        id: mockExercise.id,
        sets: mockSets,
        date,
        type: mockExercise.type,
        sort: 1,
      });

      expect(realm.create).toHaveBeenCalledTimes(1);
      expect(realm.create).toBeCalledWith('Workout', {
        id: '2018-05-04T00:00:00.000Z',
        date,
      });
      expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
      expect(mockRealmWorkout.exercises.push).toBeCalledWith({
        ...mockExercise,
        sets: mockSets,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });

    it('updates the workout if is already there', () => {
      realm.objectForPrimaryKey = jest.fn(() => mockRealmWorkout);

      addExercisePaperForWorkout(dispatch, date, {
        id: mockExercise.id,
        sets: mockSets,
        date: mockExercise.date,
        type: mockExercise.type,
        sort: 1,
      });

      expect(realm.create).not.toBeCalled();
      expect(mockRealmWorkout.exercises.push).toHaveBeenCalledTimes(1);
      expect(mockRealmWorkout.exercises.push).toBeCalledWith({
        id: mockExercise.id,
        sets: mockSets,
        date: mockExercise.date,
        type: mockExercise.type,
        sort: 1,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });

    it('updates the exercise if it already exists', () => {
      const newExercise = {
        id: '2018-05-04T00:00:00.000Z_bench-press',
        date,
        sets: mockSets,
      };

      const workout = {
        id: '2018-05-04T00:00:00.000Z',
        date,
        exercises: {
          filtered: () => [mockRealmExercise],
          push: jest.fn(),
        },
      };

      realm.create = jest.fn(() => workout);
      realm.objectForPrimaryKey = jest.fn(() => workout);

      addExercisePaperForWorkout(dispatch, workout.date, {
        id: newExercise.id,
        sets: mockSets,
        date: mockExercise.date,
        type: mockExercise.type,
        sort: 1,
      });

      expect(workout.exercises.push).not.toBeCalled();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });
  });
});
