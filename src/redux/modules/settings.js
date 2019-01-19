/* @flow */

import { AsyncStorage } from 'react-native';

import { Settings } from '../../utils/constants';
import type { DispatchType } from '../../types';

export type EditSetsScreenType = 'list' | 'paper';

type SettingsType = {
  editSetsScreenType: EditSetsScreenType,
};

export const EDIT_SETS_SCREEN_TYPE = 'dziku/settings/EDIT_SETS_SCREEN_TYPE';

type State = SettingsType;
type Action = {
  type: typeof EDIT_SETS_SCREEN_TYPE,
  payload: EditSetsScreenType,
};

export const initialState: State = {
  editSetsScreenType: 'list',
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case EDIT_SETS_SCREEN_TYPE: {
      return { ...state, editSetsScreenType: action.payload };
    }
    default:
      return state;
  }
}

export const setEditSetsScreenType = (payload: EditSetsScreenType) => async (
  dispatch: (args: DispatchType<EditSetsScreenType>) => void
) => {
  await AsyncStorage.setItem(Settings.editSetsScreen, payload);
  return dispatch({
    type: EDIT_SETS_SCREEN_TYPE,
    payload,
  });
};
