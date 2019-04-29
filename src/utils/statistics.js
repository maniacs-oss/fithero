/* @flow */

import type { WorkoutSchemaType } from '../database/types';

export const groupWorkoutsByWeek = (
  workouts: Array<WorkoutSchemaType>,
  weeks: Array<Date>
) => {
  const weekGroupNumbers: Array<number> = weeks.map(() => 0);

  workouts.forEach(w => {
    for (let i = 1; i < weeks.length; i++) {
      if (w.date < weeks[i]) {
        weekGroupNumbers[i - 1]++;
        break;
      }

      if (i === weeks.length - 1 && w.date >= weeks[i]) {
        weekGroupNumbers[weekGroupNumbers.length - 1]++;
      }
    }
  });

  return weekGroupNumbers;
};
