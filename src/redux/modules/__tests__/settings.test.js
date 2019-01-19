/* @flow */

import { AsyncStorage } from 'react-native';

import reducer, {
  EDIT_SETS_SCREEN_TYPE,
  initialState,
  setEditSetsScreenType,
} from '../settings';
import { Settings } from '../../../utils/constants';

jest.mock('react-native', () => ({
  AsyncStorage: { setItem: jest.fn() },
}));

describe('EDIT_SETS_SCREEN_TYPE', () => {
  it('calls AsyncStorage when switching editSetsScreenType', async () => {
    const dispatch = jest.fn();
    setEditSetsScreenType('paper')(dispatch);

    expect(AsyncStorage.setItem).toBeCalledWith(
      Settings.editSetsScreen,
      'paper'
    );
  });

  it('handles EDIT_SETS_SCREEN_TYPE', async () => {
    const newState = reducer(initialState, {
      type: EDIT_SETS_SCREEN_TYPE,
      payload: 'paper',
    });

    expect(newState).toEqual({
      editSetsScreenType: 'paper',
    });
  });
});
