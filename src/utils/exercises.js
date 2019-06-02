/* @flow */

import i18n from './i18n';

export const getExerciseName = (key: string, name: ?string) => {
  if (name) {
    return name;
  }
  return i18n.t(`exercise__${key}`);
};

export const getExerciseMuscleName = (muscleId: string) =>
  i18n.t(`muscle__${muscleId}`);

export const searchExerciseByName = (
  searchQuery: string,
  exerciseName: string
) => {
  const query = searchQuery.toLowerCase().replace(/[^0-9a-z-A-Z ]/gi, '');
  const name = exerciseName.toLowerCase().replace(/[^0-9a-z-A-Z]/gi, '');

  const queries = query.split(' ');
  for (let i = 0; i < queries.length; i++) {
    if (!name.includes(queries[i])) {
      return false;
    }
  }

  return true;
};
