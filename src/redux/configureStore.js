/* @flow */

import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import settings from './modules/settings';

const store = createStore(
  combineReducers({
    settings,
  }),
  applyMiddleware(thunk)
);

export default store;
