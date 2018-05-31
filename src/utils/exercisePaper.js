/* @flow */

import type { ExerciseLog } from '../types';
import type { SetSchemaType } from '../database/types';
import { getSetSchemaId } from '../database/utils';

export const parseSummary = (
  exerciseSummary: string,
  day: string,
  exerciseKey: string
): ExerciseLog => {
  const sets: Array<SetSchemaType> = [];
  let comments = '';

  const lines = exerciseSummary
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  let setIndex = 1;
  lines.forEach((line, index) => {
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
        });
        setIndex++;
      }
    } else if (index === lines.length - 1) {
      comments = line;
    }
  });

  return {
    sets,
    comments,
  };
};

export const generateSummary = (log: ExerciseLog) => {
  const sets = [];
  log.sets.forEach(set => {
    sets.push(`${set.reps}x${set.weight}`);
  });

  return `${sets.join(`\n`)}${log.comments ? `\n\n${log.comments}` : ''}`;
};
