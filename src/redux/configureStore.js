/* @flow */

import { createStore, combineReducers } from 'redux';

import workouts from './modules/workouts';

const store = createStore(
  combineReducers({
    workouts,
  })
);

export default store;
