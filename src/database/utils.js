/* @flow */

import leftPad from 'left-pad';

export const getExerciseSchemaId = (day: string, exerciseKey: string) =>
  `${day}_${exerciseKey}`;

export const getExerciseSchemaIdFromSet = (setId: string) => {
  const parts = setId.split('_');
  return `${parts[0]}_${parts[1]}`;
};

export const getSetSchemaId = (
  day: string,
  exerciseKey: string,
  index: number
) => `${getExerciseSchemaId(day, exerciseKey)}_${leftPad(index, 3, '0')}`;

export const extractWorkoutKeyFromDatabase = (id: string) => id.split('_')[0];

export const extractExerciseKeyFromDatabase = (id: string) => id.split('_')[1];

export const extractSetIndexFromDatabase = (id: string) =>
  parseInt(id.split('_')[2], 10);
