/* @flow */

import { AsyncStorage } from 'react-native';

import { Settings } from '../../utils/constants';
import type { DispatchType } from '../../types';

export type EditSetsScreenType = 'list' | 'paper';
export type DefaultUnitSystemType = 'metric' | 'imperial';

type SettingsType = {
  editSetsScreenType: EditSetsScreenType,
  defaultUnitSystem: DefaultUnitSystemType,
};

export const INIT_SETTINGS = 'dziku/settings/INIT_SETTINGS';
export const EDIT_SETS_SCREEN_TYPE = 'dziku/settings/EDIT_SETS_SCREEN_TYPE';
export const DEFAULT_UNIT_SYSTEM_TYPE =
  'dziku/settings/DEFAULT_UNIT_SYSTEM_TYPE';

type State = SettingsType;
type Action =
  | {
      type: typeof INIT_SETTINGS,
      payload: State,
    }
  | {
      type: typeof EDIT_SETS_SCREEN_TYPE,
      payload: EditSetsScreenType,
    }
  | {
      type: typeof DEFAULT_UNIT_SYSTEM_TYPE,
      payload: DefaultUnitSystemType,
    };

export const initialState: State = {
  editSetsScreenType: 'list',
  defaultUnitSystem: 'metric',
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case INIT_SETTINGS: {
      return action.payload;
    }
    case EDIT_SETS_SCREEN_TYPE: {
      return { ...state, editSetsScreenType: action.payload };
    }
    case DEFAULT_UNIT_SYSTEM_TYPE: {
      return { ...state, defaultUnitSystem: action.payload };
    }
    default:
      return state;
  }
}

export const initSettings = (payload: State) => ({
  type: INIT_SETTINGS,
  payload,
});

export const setEditSetsScreenType = (payload: EditSetsScreenType) => async (
  dispatch: (args: DispatchType<EditSetsScreenType>) => void
) => {
  await AsyncStorage.setItem(Settings.editSetsScreen, payload);
  return dispatch({
    type: EDIT_SETS_SCREEN_TYPE,
    payload,
  });
};

export const setDefaultUnitSystem = (payload: DefaultUnitSystemType) => async (
  dispatch: (args: DispatchType<DefaultUnitSystemType>) => void
) => {
  await AsyncStorage.setItem(Settings.defaultUnitSystem, payload);
  return dispatch({
    type: DEFAULT_UNIT_SYSTEM_TYPE,
    payload,
  });
};
