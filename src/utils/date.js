/* @flow */

// import { NativeModules } from 'react-native';
import moment from 'moment';

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

export const getCurrentWeek = (date: Date) => {
  const now = moment(date);
  const start = now.startOf('week');
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

export const dateToString = (date: Date) => moment(date).toISOString();

export const toDate = (dateString: string) => moment(dateString).toDate();

export const getDatePrettyFormat = (dateString: string, today: string) => {
  const date = moment(dateString);
  const isToday = date.isSame(moment(today), 'day');

  if (isToday) {
    return `${i18n.t('today')}, ${date.format('MMMM D')}`;
  }
  return date.format('dddd, MMMM D');
};
