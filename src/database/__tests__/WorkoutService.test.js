/* @flow */

import realm from '../index';
import { addExerciseForWorkout, getWorkoutsByRange } from '../WorkoutService';
import { toDate } from '../../utils/date';
import { GET_WORKOUT } from '../../redux/modules/workouts';

const mockSets = [
  {
    id: '2018-05-04T00:00:00.000Z_bench-press_001',
    reps: 18,
    weight: 100,
  },
  {
    id: '2018-05-04T00:00:00.000Z_bench-press_002',
    reps: 7,
    weight: 105.5,
  },
];

const mockExercise = {
  id: '2018-05-04T00:00:00.000Z_bench-press',
  sets: {
    filtered: () => mockSets,
    forEach: Array.prototype.forEach,
  },
};

const mockWorkout = {
  id: '2018-05-04T00:00:00.000Z',
  date: toDate('2018-05-04T00:00:00.000Z'),
  exercises: {
    filtered: () => [],
    push: jest.fn(),
  },
};

jest.mock(
  'realm',
  () =>
    function Realm() {
      return {
        create: jest.fn(() => mockWorkout),
        delete: jest.fn(),
        objectForPrimaryKey: jest.fn(),
        write: jest.fn(f => f()),
      };
    }
);

describe('WorkoutService', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    realm.create = jest.fn(() => mockWorkout);
    realm.delete = jest.fn();
    realm.objectForPrimaryKey = jest.fn();
    realm.write = jest.fn(f => f());

    jest.clearAllMocks();
  });

  describe('getWorkoutsByRange', () => {
    it('dispatches an action when getting workouts', () => {
      realm.objects = jest.fn(() => ({
        filtered: jest.fn(() => [mockWorkout]),
      }));

      getWorkoutsByRange(
        dispatch,
        toDate('2018-05-04T00:00:00.000Z'),
        toDate('2018-05-04T00:00:00.000Z')
      );

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });
  });

  describe('addExerciseForWorkout', () => {
    it('adds a workout if it is not there yet', () => {
      addExerciseForWorkout(dispatch, toDate('2018-05-04T00:00:00.000Z'), {
        id: mockExercise.id,
        sets: mockSets,
      });

      expect(realm.create).toHaveBeenCalledTimes(1);
      expect(realm.create).toBeCalledWith('Workout', {
        id: '2018-05-04T00:00:00.000Z',
        date: toDate('2018-05-04T00:00:00.000Z'),
      });
      expect(mockWorkout.exercises.push).toHaveBeenCalledTimes(1);
      expect(mockWorkout.exercises.push).toBeCalledWith({
        id: mockExercise.id,
        sets: mockSets,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [mockWorkout],
      });
    });

    it('updates the workout if is already there', () => {
      realm.objectForPrimaryKey = jest.fn(() => mockWorkout);

      addExerciseForWorkout(dispatch, toDate('2018-05-04T00:00:00.000Z'), {
        id: mockExercise.id,
        sets: mockSets,
      });

      expect(realm.create).not.toBeCalled();
      expect(mockWorkout.exercises.push).toHaveBeenCalledTimes(1);
      expect(mockWorkout.exercises.push).toBeCalledWith({
        id: mockExercise.id,
        sets: mockSets,
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
        sets: mockSets,
      };

      const workout = {
        id: '2018-05-04T00:00:00.000Z',
        date: toDate('2018-05-04T00:00:00.000Z'),
        exercises: {
          filtered: () => [mockExercise],
          push: jest.fn(),
        },
      };

      realm.create = jest.fn(() => workout);
      realm.objectForPrimaryKey = jest.fn(() => workout);

      addExerciseForWorkout(dispatch, workout.date, {
        id: newExercise.id,
        sets: mockSets,
      });

      expect(workout.exercises.push).not.toBeCalled();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_WORKOUT,
        payload: [workout],
      });
    });
  });
});
