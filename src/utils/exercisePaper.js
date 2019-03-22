/* @flow */

import type { ExerciseLog } from '../types';
import type { WorkoutSetSchemaType } from '../database/types';
import { getSetSchemaId } from '../database/utils';
import { toDate } from './date';
import type { DefaultUnitSystemType } from '../redux/modules/settings';
import { toLb, toTwoDecimals } from './metrics';

export const parseSummary = (
  exerciseSummary: string,
  day: string,
  exerciseKey: string
): ExerciseLog => {
  const sets: Array<WorkoutSetSchemaType> = [];

  const lines = exerciseSummary
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  let setIndex = 1;
  lines.forEach(line => {
    // We remove whitespaces too so we fix mistakes like "5x 30"
    const isSet = /\d+x\d+\.?\d*/.test(line.replace(/\s/g, ''));
    if (isSet) {
      const set = line.split('x');
      // We do not allow a set with 0 reps
      const reps = parseInt(set[0], 10);
      if (reps > 0) {
        sets.push({
          id: getSetSchemaId(day, exerciseKey, setIndex),
          reps,
          // Weight can be a float (reps cannot)
          weight: parseFloat(set[1]),
          type: exerciseKey,
          date: toDate(day),
        });
        setIndex++;
      }
    }
  });

  return {
    sets,
  };
};

export const generateSummary = (
  log: ExerciseLog,
  unit: DefaultUnitSystemType
) => {
  const sets = [];
  log.sets.forEach(set => {
    sets.push(
      `${set.reps}x${toTwoDecimals(
        unit === 'metric' ? set.weight : toLb(set.weight)
      )}`
    );
  });

  return sets.join(`\n`);
};
