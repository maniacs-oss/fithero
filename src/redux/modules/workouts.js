/* @flow */

import type { WorkoutSchemaType } from '../../database/types';

export const GET_WORKOUT = 'dziku/workouts/GET_WORKOUT';

type State = { [date: string]: WorkoutSchemaType };
type Action = {
  type: string,
  payload: Array<WorkoutSchemaType>,
};

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case GET_WORKOUT: {
      const workouts = action.payload.reduce(
        (obj, item) => ({ ...obj, [item.id]: item }),
        {}
      );
      return { ...state, ...workouts };
    }
    default: {
      return state;
    }
  }
}

export const getWorkouts = (workouts: Array<WorkoutSchemaType>) => ({
  type: GET_WORKOUT,
  payload: workouts,
});
