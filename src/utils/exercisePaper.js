/* @flow */

export const parseSummary = (exerciseSummary: string) => {
  const sets = [];
  let comments = '';

  const lines = exerciseSummary
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  lines.forEach((line, index) => {
    // We remove whitespaces too so we fix mistakes like "5x 30"
    const isSet = /\d+x\d+\.?\d*/.test(line.replace(/\s/g, ''));
    if (isSet) {
      const set = line.split('x');
      // We do not allow a set with 0 reps
      const reps = parseInt(set[0], 10);
      if (reps > 0) {
        sets.push({
          reps,
          // Weight can be a float (reps cannot)
          weight: parseFloat(set[1]),
        });
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
