/* @flow */

import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import settings from './modules/settings';
import workouts from './modules/workouts';

const store = createStore(
  combineReducers({
    settings,
    workouts,
  }),
  applyMiddleware(thunk)
);

export default store;
