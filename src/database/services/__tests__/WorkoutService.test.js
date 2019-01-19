/* @flow */

import realm from '../../index';
import { getWorkout, getWorkoutsByRange } from '../WorkoutService';
import { toDate } from '../../../utils/date';
import { GET_WORKOUT } from '../../../redux/modules/workouts';

jest.mock('realm');

const date = toDate('2018-05-04T00:00:00.000Z');

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
});
