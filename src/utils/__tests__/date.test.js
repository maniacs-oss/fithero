/* @flow */

import moment from 'moment';
import I18nJs from 'i18n-js'; // eslint-disable-line import/no-extraneous-dependencies

import {
  getCurrentWeek,
  getShortDayInfo,
  getDatePrettyFormat,
  getToday,
  isSameDay,
  getDay,
  getFirstAndLastMonthDay,
  getFirstAndLastWeekday,
  setMomentFirstDayOfTheWeek,
} from '../date';
import { clearTranslateCache } from '../i18n';

beforeEach(() => {
  moment.locale('en');
});

describe('getCurrentWeek and getShortDayInfo', () => {
  it('return correct days for current week', () => {
    // US locale, from 29.04 to 05.05
    setMomentFirstDayOfTheWeek('en', 0, true);
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

test('getToday', () => {
  expect(moment().startOf('day')).toEqual(getToday());
});

test('isSame', () => {
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
    clearTranslateCache();
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
  it('returns the correct day of the week word in short form', () => {
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-05T00:00:00.000Z',
        true
      )
    ).toEqual('Fri, May 4');

    moment.locale('es');
    I18nJs.locale = 'es';
    expect(
      getDatePrettyFormat(
        '2018-05-04T00:00:00.000Z',
        '2018-05-05T00:00:00.000Z',
        true
      )
    ).toEqual('vie., mayo 4');
  });
});

test('getDay', () => {
  expect(getDay('2018-06-23')).toEqual('2018-06-22T22:00:00.000Z');
});

describe('getFirstAndLastWeekday', () => {
  test('the week is in the same month', () => {
    const date = moment(new Date('2019-01-19T00:00:00.000')).utc();
    const [first, last] = getFirstAndLastWeekday(date);

    expect(first).toEqual(new Date('2019-01-13T00:00:00.000Z'));
    expect(last).toEqual(new Date('2019-01-19T23:59:59.999Z'));
  });

  test('the week is in different month', () => {
    const date = moment(new Date('2019-02-02T00:00:00.000')).utc();
    const [first, last] = getFirstAndLastWeekday(date);

    expect(first).toEqual(new Date('2019-01-27T00:00:00.000Z'));
    expect(last).toEqual(new Date('2019-02-02T23:59:59.999Z'));
  });
});

describe('getFirstAndLastMonthDay', () => {
  test('first month of the year', () => {
    const date = moment(new Date('2019-01-19T00:00:00.000')).utc();
    const [first, last] = getFirstAndLastMonthDay(date);

    expect(first).toEqual(new Date('2019-01-01T00:00:00.000Z'));
    expect(last).toEqual(new Date('2019-01-31T23:59:59.999Z'));
  });
  test('February', () => {
    const date = moment(new Date('2019-02-19T00:00:00.000')).utc();
    const [first, last] = getFirstAndLastMonthDay(date);

    expect(first).toEqual(new Date('2019-02-01T00:00:00.000Z'));
    expect(last).toEqual(new Date('2019-02-28T23:59:59.999Z'));
  });
});
