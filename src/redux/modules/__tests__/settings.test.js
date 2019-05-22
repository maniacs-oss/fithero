/* @flow */

import AsyncStorage from '@react-native-community/async-storage';

import reducer, {
  APP_THEME,
  DEFAULT_UNIT_SYSTEM,
  EDIT_SETS_SCREEN_TYPE,
  FIRST_DAY_OF_THE_WEEK,
  INIT_SETTINGS,
  initialState,
  setEditSetsScreenType,
  setFirstDayOfTheWeek,
} from '../settings';
import { Settings } from '../../../utils/constants';
import { setMomentFirstDayOfTheWeek } from '../../../utils/date';

jest.mock('../../../utils/date');

describe('EDIT_SETS_SCREEN_TYPE', () => {
  it('calls AsyncStorage when switching editSetsScreenType', async () => {
    const dispatch = jest.fn();
    setEditSetsScreenType('paper')(dispatch);

    expect(AsyncStorage.setItem).toBeCalledWith(
      Settings.editSetsScreen,
      'paper'
    );
  });

  it('handles INIT_SETTINGS', async () => {
    const payload = {
      editSetsScreenType: 'paper',
      defaultUnitSystem: 'imperial',
      firstDayOfTheWeek: 'monday',
      appTheme: 'default',
    };
    const newState = reducer(initialState, {
      type: INIT_SETTINGS,
      payload,
    });

    expect(newState).toEqual(payload);
  });

  it('handles EDIT_SETS_SCREEN_TYPE', async () => {
    const newState = reducer(initialState, {
      type: EDIT_SETS_SCREEN_TYPE,
      payload: 'paper',
    });

    expect(newState).toEqual({
      defaultUnitSystem: 'metric',
      editSetsScreenType: 'paper',
      firstDayOfTheWeek: 'monday',
      appTheme: 'default',
    });
  });

  it('handles DEFAULT_UNIT_SYSTEM_TYPE', async () => {
    const newState = reducer(initialState, {
      type: DEFAULT_UNIT_SYSTEM,
      payload: 'imperial',
    });

    expect(newState).toEqual({
      defaultUnitSystem: 'imperial',
      editSetsScreenType: 'list',
      firstDayOfTheWeek: 'monday',
      appTheme: 'default',
    });
  });

  it('handles FIRST_DAY_OF_THE_WEEK', async () => {
    const newState = reducer(initialState, {
      type: FIRST_DAY_OF_THE_WEEK,
      payload: 'saturday',
    });

    expect(newState).toEqual({
      defaultUnitSystem: 'metric',
      editSetsScreenType: 'list',
      firstDayOfTheWeek: 'saturday',
      appTheme: 'default',
    });
  });

  it('handles APP_THEME', async () => {
    const newState = reducer(initialState, {
      type: APP_THEME,
      payload: 'dark',
    });

    expect(newState).toEqual({
      defaultUnitSystem: 'metric',
      editSetsScreenType: 'list',
      firstDayOfTheWeek: 'monday',
      appTheme: 'dark',
    });
  });

  it('calls setMomentFirstDayOfTheWeek on setting first day of the week', () => {
    setFirstDayOfTheWeek('saturday')(jest.fn());
    expect(setMomentFirstDayOfTheWeek).toBeCalled();
  });
});
