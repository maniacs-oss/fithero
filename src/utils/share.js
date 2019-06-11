/* @flow */

import { Share } from 'react-native';

import type { WorkoutSchemaType } from '../database/types';
import { getExerciseName } from './exercises';
import i18n from './i18n';
import { toLb, toTwoDecimals } from './metrics';

export const shareWorkout = async (workout: WorkoutSchemaType) => {
  let text = 'FitHero - Tue 11th of June\n\n';
  workout.exercises.forEach(e => {
    text += `${getExerciseName(e.type, e.name)}\n`;
    e.sets.forEach((s, i) => {
      text += `${i + 1}. ${
        e.weight_unit === 'metric'
          ? `${i18n.t('kg.value', {
              count: toTwoDecimals(s.weight),
            })}`
          : `${toTwoDecimals(toLb(s.weight))} ${i18n.t('lb')}`
      } x ${i18n.t('reps.value', {
        count: s.reps,
      })}\n`;
    });
    text += '\n';
  });
  await Share.share({
    message: text,
  });
};
