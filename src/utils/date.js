/* @flow */

// import { NativeModules } from 'react-native';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';

// To import locales we want translations from
// import 'moment/locale/pl';
// import 'moment/locale/es';
// moment.locale(NativeModules.RNI18n.languages[0]);

// To change the starting week day to Monday
// Although locale do it for you, it can override the locale
// moment.updateLocale('en', {
//   week: {
//     dow: 1,
//   },
// });

import i18n from './i18n';
import regionDayMap from './regionDayMap';
import type { FirstDayOfTheWeekType } from '../redux/modules/settings';

// TODO this function won't work properly if we change the moment.locale
const getFirstDayOfTheWeek = (
  date: Date,
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  const now = moment(date);
  const firstDay = firstDayOfTheWeekToNumber(firstDayOfTheWeek);
  const firstWeekDay = now
    .clone()
    .weekday(firstDay)
    .startOf('day');
  if (!firstWeekDay.isAfter(now)) {
    return firstWeekDay;
  }
  return now
    .clone()
    .weekday(firstDay - 7)
    .startOf('day');
};

export const getCurrentWeek = (
  date: Date,
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  const start = getFirstDayOfTheWeek(date, firstDayOfTheWeek);
  const days = [start.clone().toDate()];

  for (let i = 1; i <= 6; i++) {
    days.push(
      start
        .clone()
        .add(i, 'day')
        .toDate()
    );
  }

  return days;
};

export const getFirstAndLastWeekday = (
  date: Date,
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  const now = moment(date);
  const firstDay = firstDayOfTheWeekToNumber(firstDayOfTheWeek);
  const start = getFirstDayOfTheWeek(date, firstDayOfTheWeek);
  const end = now
    .clone()
    .weekday(firstDay + 6)
    .startOf('day');

  return [start.toDate(), end.toDate()];
};

export const getShortDayInfo = (dateString: string) => {
  const momentDate = moment(dateString);
  return {
    date: momentDate.get('date'),
    day: momentDate.format('ddd'),
  };
};

export const getToday = () => moment().startOf('day');

export const isSameDay = (date: Date, today: string) =>
  moment(date).isSame(moment(today), 'day');

export const dateToWorkoutId = (date: Date | string) =>
  moment(date).format('YYYYMMDD');

export const dateToString = (date: Date) => moment(date).toISOString();

export const toDate = (dateString: string) => moment(dateString).toDate();

export const getDatePrettyFormat = (
  dateString: Date | string,
  today: string,
  short?: boolean = false
) => {
  const date = moment(dateString);
  const isToday = date.isSame(moment(today), 'day');

  if (isToday) {
    return `${i18n.t('today')}${!short ? `, ${date.format('MMMM D')}` : ''}`;
  }
  return date.format(`${!short ? 'dddd' : 'ddd'}, MMMM D`);
};

export const getDay = (day: string) =>
  moment(day)
    .startOf('day')
    .toISOString();

export const formatDate = (date: Date | string, format: string) =>
  moment(date).format(format);

export const getFirstAndLastMonthDay = (date: Date) => {
  const now = moment(date);
  const start = now.startOf('month');
  const end = now.clone().endOf('month');

  return [start.toDate(), end.toDate()];
};

export const getWeekStartByLocale = (): FirstDayOfTheWeekType => {
  const country = RNLocalize.getCountry();

  const day = regionDayMap[country];
  if (day === 0) {
    return 'sunday';
  } else if (day === 6) {
    return 'saturday';
  }
  return 'monday';
};

export const firstDayOfTheWeekToNumber = (
  firstDayOfTheWeek: FirstDayOfTheWeekType
) => {
  let firstDay = 1; // Monday
  if (firstDayOfTheWeek === 'sunday') {
    firstDay = 0;
  } else if (firstDayOfTheWeek === 'saturday') {
    firstDay = 6;
  }
  return firstDay;
};

export const getSafeTimezoneTime = (date: Date) => {
  return moment(date)
    .subtract(1, 'day')
    .toDate();
};
