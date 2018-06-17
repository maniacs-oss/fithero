/* @flow */

import reducer, {
  ADD_SET,
  getExercise,
  getSet,
  getWorkouts,
  removeSet,
  UPDATE_SET,
} from '../workouts';
import { toDate } from '../../../utils/date';
import type {
  ExerciseSchemaType,
  WorkoutSchemaType,
} from '../../../database/types';

describe('workouts reducer', () => {
  const initialState = {};
  const workouts: Array<WorkoutSchemaType> = [
    {
      id: '2018-05-04T00:00:00.000Z',
      comments: 'Test comment',
      date: toDate('2018-05-04T00:00:00.000Z'),
      exercises: [
        {
          id: '2018-05-04T00:00:00.000Z_barbell-squat',
          sets: [
            {
              id: '2018-05-04T00:00:00.000Z_barbell-squat_001',
              reps: 8,
              weight: 120,
            },
            {
              id: '2018-05-04T00:00:00.000Z_barbell-squat_002',
              reps: 6,
              weight: 120,
            },
          ],
        },
        {
          id: '2018-05-04T00:00:00.000Z_barbell-row',
          sets: [
            {
              id: '2018-05-04T00:00:00.000Z_barbell-row_001',
              reps: 8,
              weight: 80,
            },
          ],
        },
      ],
    },
  ];
  const exercise: ExerciseSchemaType = {
    id: '2018-05-04T00:00:00.000Z_bench-press',
    sets: [
      {
        id: '2018-05-04T00:00:00.000Z_bench-press_001',
        reps: 6,
        weight: 100,
      },
    ],
  };

  it('returns current state by default', () => {
    // $FlowFixMe reducer is typed but still this is how Redux works
    const newState = reducer(initialState, { type: '__INVALID_ACTION__' });
    expect(newState).toEqual(initialState);
  });

  describe('GET_WORKOUT', () => {
    it('converts the array of workouts to an object with ids as keys', () => {
      const newState = reducer(initialState, getWorkouts(workouts));

      expect(newState).toEqual({ [workouts[0].id]: workouts[0] });
    });
  });

  describe('ADD_EXERCISE', () => {
    it('creates the workout if is the first exercise added', () => {
      const newState = reducer(initialState, getExercise(exercise));

      expect(newState).toEqual({
        [workouts[0].id]: {
          id: workouts[0].id,
          date: workouts[0].date,
          exercises: [exercise],
        },
      });
    });

    it('adds the exercise to an existing workout', () => {
      const newState = reducer(
        { [workouts[0].id]: workouts[0] },
        getExercise(exercise)
      );

      expect(newState[workouts[0].id].exercises).toEqual([
        ...workouts[0].exercises,
        exercise,
      ]);
    });
  });

  describe('ADD_SET', () => {
    it('adds a new set', () => {
      const set = {
        id: '2018-05-04T00:00:00.000Z_barbell-squat_002',
        reps: 8,
        weight: 110,
      };
      const newState = reducer(
        { [workouts[0].id]: workouts[0] },
        getSet(ADD_SET, set)
      );

      expect(newState[workouts[0].id].exercises[0].sets).toEqual([
        ...workouts[0].exercises[0].sets,
        set,
      ]);
    });
  });

  describe('UPDATE_SET', () => {
    it('updates an existing set', () => {
      const updatedSet = {
        id: workouts[0].exercises[0].sets[0].id,
        reps: workouts[0].exercises[0].sets[0].reps - 2,
        weight: workouts[0].exercises[0].sets[0].weight + 10,
      };
      const newState = reducer(
        { [workouts[0].id]: workouts[0] },
        getSet(UPDATE_SET, updatedSet)
      );

      expect(newState[workouts[0].id].exercises[0].sets).toEqual([
        updatedSet,
        workouts[0].exercises[0].sets[1],
      ]);
    });
  });

  describe('REMOVE_SET', () => {
    it('removes only a set', () => {
      const setId = workouts[0].exercises[0].sets[0].id;
      const newState = reducer(
        { [workouts[0].id]: workouts[0] },
        removeSet(setId)
      );
      const newWorkout = newState[workouts[0].id];

      expect(newWorkout.exercises.length).toBe(2);
      expect(newWorkout.exercises[0].sets.length).toEqual(1);
      expect(newWorkout.exercises[0].sets[0]).toEqual(
        workouts[0].exercises[0].sets[1]
      );
    });

    it('removes the last set so it also removes the exercise', () => {
      const setId = workouts[0].exercises[1].sets[0].id;
      const newState = reducer(
        { [workouts[0].id]: workouts[0] },
        removeSet(setId)
      );
      const newWorkout = newState[workouts[0].id];

      expect(newWorkout.exercises.length).toBe(1);
      expect(newWorkout.exercises[0]).toEqual(workouts[0].exercises[0]);
    });

    it('removes the whole workout when there are not sets left', () => {
      const getNextState = (state, setIds: Array<string>) => {
        let newState = state;
        setIds.forEach(id => {
          newState = reducer(newState, removeSet(id));
        });
        return newState;
      };

      expect(
        getNextState({ [workouts[0].id]: workouts[0] }, [
          workouts[0].exercises[0].sets[0].id,
          workouts[0].exercises[0].sets[1].id,
          workouts[0].exercises[1].sets[0].id,
        ])
      ).toEqual({});
    });
  });
});
