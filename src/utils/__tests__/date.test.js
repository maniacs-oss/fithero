/* @flow */

import moment from 'moment';
import I18nJs from 'i18n-js'; // eslint-disable-line import/no-extraneous-dependencies

import {
  getCurrentWeek,
  getShortDayInfo,
  getDatePrettyFormat,
  getToday,
  isSameDay,
} from '../date';

beforeEach(() => {
  moment.locale('en');
});

describe('getCurrentWeek and getShortDayInfo', () => {
  it('return correct days for current week', () => {
    // US locale, from 29.04 to 05.05
    const days = getCurrentWeek(new Date('2018-05-01T00:00:00.000Z'));
    const dayStrings = days.map(day => getShortDayInfo(day));
    expect(dayStrings).toEqual([
      { date: 29, day: 'Sun' },
      { date: 30, day: 'Mon' },
      { date: 1, day: 'Tue' },
      { date: 2, day: 'Wed' },
      { date: 3, day: 'Thu' },
      { date: 4, day: 'Fri' },
      { date: 5, day: 'Sat' },
    ]);
  });

  it('return correct days for current week with a particular locale', () => {
    // PL locale, from 30.04 to 06.05
    moment.locale('pl');

    const days = getCurrentWeek(new Date('2018-05-01T00:00:00.000Z'));
    const dayStrings = days.map(day => getShortDayInfo(day));
    expect(dayStrings).toEqual([
      { date: 30, day: 'pon' },
      { date: 1, day: 'wt' },
      { date: 2, day: 'śr' },
      { date: 3, day: 'czw' },
      { date: 4, day: 'pt' },
      { date: 5, day: 'sob' },
      { date: 6, day: 'ndz' },
    ]);
  });
});

it('getToday', () => {
  expect(moment().startOf('day')).toEqual(getToday());
});

it('isSame', () => {
  expect(
    isSameDay(new Date('2018-05-01T22:00:00.000Z'), '2018-05-01T22:00:00.000Z')
  ).toBe(true);
  expect(
    isSameDay(new Date('2018-05-01T22:00:00.000Z'), '2018-05-04T22:00:00.000Z')
  ).toBe(false);
});

describe('getDatePrettyFormat', () => {
  it('returns "Today" word if it is today', () => {
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-04T00:00:00.000Z'
      )
    ).toEqual('Today, May 4');

    moment.locale('es');
    I18nJs.locale = 'es';
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-04T00:00:00.000Z'
      )
    ).toEqual('Hoy, mayo 4');
  });
  it('returns the correct day of the week word if not today', () => {
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-05T00:00:00.000Z'
      )
    ).toEqual('Friday, May 4');

    moment.locale('es');
    I18nJs.locale = 'es';
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-05T00:00:00.000Z'
      )
    ).toEqual('viernes, mayo 4');
  });
});
