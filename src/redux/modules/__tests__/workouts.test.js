/* @flow */

import reducer, {
  ADD_SET,
  getExercise,
  getSet,
  getWorkouts,
  removeSet,
  UPDATE_SET,
  updateExercise,
} from '../workouts';
import { toDate } from '../../../utils/date';
import type {
  ExerciseSchemaType,
  WorkoutSchemaType,
} from '../../../database/types';

const date = toDate('2018-05-04T00:00:00.000Z');

describe('workouts reducer', () => {
  const initialState = {};

  const barbellSquatExercise: ExerciseSchemaType = {
    id: '2018-05-04T00:00:00.000Z_barbell-squat',
    sets: [
      {
        id: '2018-05-04T00:00:00.000Z_barbell-squat_001',
        reps: 8,
        weight: 120,
        date,
        type: 'barbell-squat',
      },
      {
        id: '2018-05-04T00:00:00.000Z_barbell-squat_002',
        reps: 6,
        weight: 120,
        date,
        type: 'barbell-squat',
      },
    ],
    date,
    type: 'barbell-squat',
    sort: 1,
  };

  const barbellRowExercise: ExerciseSchemaType = {
    id: '2018-05-04T00:00:00.000Z_barbell-row',
    sets: [
      {
        id: '2018-05-04T00:00:00.000Z_barbell-row_001',
        reps: 8,
        weight: 80,
        date,
        type: 'barbell-row',
      },
    ],
    date,
    type: 'barbell-row',
    sort: 2,
  };

  const workouts: Array<WorkoutSchemaType> = [
    {
      id: '2018-05-04T00:00:00.000Z',
      comments: 'Test comment',
      date,
      exercises: [barbellSquatExercise, barbellRowExercise],
    },
  ];
  const exercise: ExerciseSchemaType = {
    id: '2018-05-04T00:00:00.000Z_bench-press',
    sets: [
      {
        id: '2018-05-04T00:00:00.000Z_bench-press_001',
        reps: 6,
        weight: 100,
        date,
        type: 'bench-press',
      },
    ],
    date,
    type: 'bench-press',
    sort: 3,
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
        date,
        type: 'barbell-squat',
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
        date,
        type: 'barbell-squat',
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

    it('reassess the sort when removing an exercise', () => {
      const firstState = reducer(
        { [workouts[0].id]: workouts[0] },
        getExercise(exercise)
      );
      const setId = workouts[0].exercises[1].sets[0].id;
      const newState = reducer(firstState, removeSet(setId));

      const newWorkout = newState[workouts[0].id];

      expect(newWorkout.exercises.length).toBe(2);
      expect(newWorkout.exercises[0].sort).toBe(1);
      expect(newWorkout.exercises[1].sort).toBe(2);
    });
  });

  describe('UPDATE_EXERCISE', () => {
    const firsState = reducer(initialState, getWorkouts(workouts));
    expect(Object.keys(firsState)).toHaveLength(1);
    expect(firsState[workouts[0].id].exercises[0].sets).toHaveLength(2);

    it('updates the whole exercise', () => {
      const updatedSet = {
        ...barbellSquatExercise.sets[0],
        reps: barbellSquatExercise.sets[0].reps + 4,
      };

      const newState = reducer(
        firsState,
        updateExercise({
          ...barbellSquatExercise,
          // We delete one set and update the other
          sets: [updatedSet],
        })
      );

      expect(newState[workouts[0].id].exercises[0].sets).toHaveLength(1);
      expect(newState[workouts[0].id].exercises[0].sets[0]).toEqual(updatedSet);
    });

    it('deletes the whole exercise because we deleted all the sets', () => {
      const newState = reducer(
        firsState,
        updateExercise({
          ...barbellSquatExercise,
          sets: [],
        })
      );

      expect(newState[workouts[0].id].exercises).toHaveLength(1);
      expect(newState[workouts[0].id].exercises[0].id).not.toEqual(
        barbellSquatExercise.id
      );
    });

    it('deletes the whole workout because no more exercises are left', () => {
      const secondState = reducer(
        firsState,
        updateExercise({
          ...barbellSquatExercise,
          sets: [],
        })
      );

      const newState = reducer(
        secondState,
        updateExercise({
          ...barbellRowExercise,
          sets: [],
        })
      );

      expect(Object.keys(newState)).toHaveLength(0);
    });
  });
});
