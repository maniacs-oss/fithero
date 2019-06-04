/* @flow */

import reducer, {
  APP_THEME,
  DEFAULT_UNIT_SYSTEM,
  FIRST_DAY_OF_THE_WEEK,
  INIT_SETTINGS,
  initialState,
  setFirstDayOfTheWeek,
} from '../settings';
import { setMomentFirstDayOfTheWeek } from '../../../utils/date';

jest.mock('../../../utils/date');

describe('settings', () => {
  it('handles INIT_SETTINGS', async () => {
    const payload = {
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

  it('handles DEFAULT_UNIT_SYSTEM_TYPE', async () => {
    const newState = reducer(initialState, {
      type: DEFAULT_UNIT_SYSTEM,
      payload: 'imperial',
    });

    expect(newState).toEqual({
      defaultUnitSystem: 'imperial',
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
      firstDayOfTheWeek: 'monday',
      appTheme: 'dark',
    });
  });

  it('calls setMomentFirstDayOfTheWeek on setting first day of the week', () => {
    setFirstDayOfTheWeek('saturday')(jest.fn());
    expect(setMomentFirstDayOfTheWeek).toHaveBeenCalled();
  });
});
