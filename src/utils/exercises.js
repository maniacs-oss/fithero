/* @flow */

import i18n from './i18n';

export const extractExerciseKeyFromDatabase = (exerciseId: string) =>
  exerciseId.split('_')[1];

export const getExerciseName = (key: string) => i18n.t(`exercise__${key}`);

export const getExerciseCategoryName = (category: string) =>
  i18n.t(`exercise-category__${category}`);
