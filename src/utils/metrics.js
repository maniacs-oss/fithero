/* @flow */

import * as RNLocalize from 'react-native-localize';

import type { WorkoutExerciseSchemaType } from '../database/types';
import type { DefaultUnitSystemType } from '../redux/modules/settings';

const oneKgToLb = 2.204622622;

export const toLb = (value: number) => value * oneKgToLb;
export const toKg = (value: number) => value / oneKgToLb;
export const toTwoDecimals = (value: number) => Math.round(value * 100) / 100;

export const getWeight = (
  value: number,
  exercise: ?WorkoutExerciseSchemaType,
  defaultUnitSystem: DefaultUnitSystemType
) => {
  const unit =
    exercise && exercise.isValid() && exercise.weight_unit
      ? exercise.weight_unit
      : defaultUnitSystem;
  if (unit !== 'metric') {
    return toLb(value);
  }
  return value;
};

export const getWeightUnit = (
  exercise: ?WorkoutExerciseSchemaType,
  defaultUnitSystem: DefaultUnitSystemType
): DefaultUnitSystemType =>
  exercise && exercise.isValid() && exercise.weight_unit
    ? exercise.weight_unit
    : defaultUnitSystem;

export const getDefaultUnitSystemByCountry = (): DefaultUnitSystemType => {
  const country = RNLocalize.getCountry();
  if (
    country === 'US' ||
    country === 'UK' ||
    country === 'MM' ||
    country === 'LR'
  ) {
    return 'imperial';
  }
  return 'metric';
};
