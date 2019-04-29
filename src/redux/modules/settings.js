/* @flow */

import AsyncStorage from '@react-native-community/async-storage';

import { Settings } from '../../utils/constants';
import type { DispatchType } from '../../types';
import {
  firstDayOfTheWeekToNumber,
  getCurrentLocale,
  setMomentFirstDayOfTheWeek,
} from '../../utils/date';

export type EditSetsScreenType = 'list' | 'paper';
export type DefaultUnitSystemType = 'metric' | 'imperial';
export type FirstDayOfTheWeekType = 'monday' | 'sunday' | 'saturday';

export type SettingsType = {
  editSetsScreenType: EditSetsScreenType,
  defaultUnitSystem: DefaultUnitSystemType,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
};

export const INIT_SETTINGS = 'dziku/settings/INIT_SETTINGS';
export const EDIT_SETS_SCREEN_TYPE = 'dziku/settings/EDIT_SETS_SCREEN_TYPE';
export const DEFAULT_UNIT_SYSTEM = 'dziku/settings/DEFAULT_UNIT_SYSTEM';
export const FIRST_DAY_OF_THE_WEEK = 'dziku/settings/FIRST_DAY_OF_THE_WEEK';

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
      type: typeof DEFAULT_UNIT_SYSTEM,
      payload: DefaultUnitSystemType,
    }
  | {
      type: typeof FIRST_DAY_OF_THE_WEEK,
      payload: FirstDayOfTheWeekType,
    };

export const initialState: State = {
  editSetsScreenType: 'list',
  defaultUnitSystem: 'metric',
  firstDayOfTheWeek: 'monday',
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case INIT_SETTINGS: {
      return action.payload;
    }
    case EDIT_SETS_SCREEN_TYPE: {
      return { ...state, editSetsScreenType: action.payload };
    }
    case DEFAULT_UNIT_SYSTEM: {
      return { ...state, defaultUnitSystem: action.payload };
    }
    case FIRST_DAY_OF_THE_WEEK: {
      return { ...state, firstDayOfTheWeek: action.payload };
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
    type: DEFAULT_UNIT_SYSTEM,
    payload,
  });
};

export const setFirstDayOfTheWeek = (payload: FirstDayOfTheWeekType) => async (
  dispatch: (args: DispatchType<FirstDayOfTheWeekType>) => void
) => {
  setMomentFirstDayOfTheWeek(
    getCurrentLocale(),
    firstDayOfTheWeekToNumber(payload),
    true
  );
  await AsyncStorage.setItem(Settings.firstDayOfTheWeek, payload);
  return dispatch({
    type: FIRST_DAY_OF_THE_WEEK,
    payload,
  });
};
