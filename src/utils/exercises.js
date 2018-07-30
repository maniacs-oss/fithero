/* @flow */

import i18n from './i18n';

export const getExerciseName = (key: string) => i18n.t(`exercise__${key}`);

export const getExerciseMuscleName = (muscleId: string) =>
  i18n.t(`muscle__${muscleId}`);
