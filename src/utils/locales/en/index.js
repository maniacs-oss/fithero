/* @flow */

import { muscles, exercisesTitles } from 'dziku-exercises';

import en from './en.json';

export default {
  ...en,
  ...exercisesTitles,
  ...muscles,
};
