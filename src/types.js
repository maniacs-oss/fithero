/* @flow */

// Shared types

import type { SetSchemaType } from './database/types';

// TODO replace this type for flow-typed react-navigation 2
export type NavigationType<T> = {
  state: {
    params: T,
  },
  push: (route: string, params?: { [key: string]: mixed }) => void,
  navigate: (route: string, params?: { [key: string]: mixed }) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  setParams: (params: { [key: string]: any }) => void,
  goBack: (routeKey?: ?string) => boolean,
};

export type DispatchType<T> = {
  type: string,
  payload: T,
};

export type ExerciseType = {|
  id: string,
  primary: Array<string>,
  secondary: Array<string>,
|};

export type CategoryType = {|
  id: string,
  name: string,
|};

export type ExerciseLog = {|
  sets: Array<SetSchemaType>,
  comments?: string,
|};

export type RealmListener<T> = {|
  addListener: (data: T) => void,
  removeAllListeners: () => void,
|};
