/* @flow */

// Shared types

import type { SetSchemaType } from './database/types';

export type NavigationType<T> = {
  state: {
    params: T,
  },
  push: (route: string, params?: { [key: string]: mixed }) => void,
  navigate: (route: string, params?: { [key: string]: mixed }) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  setParams: (params: { [key: string]: any }) => void,
};

export type DispatchType<T> = {
  type: string,
  payload: T,
};

export type ExerciseType = {|
  id: string,
  category: string,
|};

export type ExerciseLog = {|
  sets: Array<SetSchemaType>,
  comments?: string,
|};

export type RealmListener<T> = {|
  addListener: (data: T) => void,
  removeAllListeners: () => void,
|};
