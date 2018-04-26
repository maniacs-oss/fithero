/* @flow */

import { generateSummary, parseSummary } from '../exercisePaper';

describe('parseSummary', () => {
  it('parses a summary case without comments', () => {
    const summary = `
  8x100
  8x110
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 8,
          weight: 100,
        },
        {
          reps: 8,
          weight: 110,
        },
      ],
      comments: '',
    });
  });

  it('parses a summary case with comments', () => {
    const summary = `
  8x100
  8x110
  
  Testing a comment.
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 8,
          weight: 100,
        },
        {
          reps: 8,
          weight: 110,
        },
      ],
      comments: 'Testing a comment.',
    });
  });

  it('parses a summary case with extra numbers and x', () => {
    const summary = `
  Ignore text
  10x100x2
  
  
  
  
  
  8x110
  7x120
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 10,
          weight: 100,
        },
        {
          reps: 8,
          weight: 110,
        },
        {
          reps: 7,
          weight: 120,
        },
      ],
      comments: '',
    });
  });

  it('parses a valid summary case with decimals in weight', () => {
    const summary = `
  10x50.35
  8x20.25
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 10,
          weight: 50.35,
        },
        {
          reps: 8,
          weight: 20.25,
        },
      ],
      comments: '',
    });
  });

  it('avoid sets with 0 repetitions', () => {
    const summary = `
  0x50
  5x50
  Testing comment.
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 5,
          weight: 50,
        },
      ],
      comments: 'Testing comment.',
    });
  });

  it('fixes whitespaces inside sets', () => {
    const summary = `
  8x 50
  10 x50
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 8,
          weight: 50,
        },
        {
          reps: 10,
          weight: 50,
        },
      ],
      comments: '',
    });
  });

  it('ignores trailing zeros', () => {
    const summary = `
  08x0100
  09x0110.5
  `;

    const result = parseSummary(summary);
    expect(result).toEqual({
      sets: [
        {
          reps: 8,
          weight: 100,
        },
        {
          reps: 9,
          weight: 110.5,
        },
      ],
      comments: '',
    });
  });
});

describe('generateSummary', () => {
  it('generates summary from a log with one set', () => {
    const log = {
      sets: [{ reps: 10, weight: 50.5 }],
      comments: '',
    };
    expect(generateSummary(log)).toEqual('10x50.5');
  });

  it('generates summary from a log without comments', () => {
    const log = {
      sets: [{ reps: 8, weight: 50.5 }, { reps: 7, weight: 45 }],
      comments: '',
    };
    expect(generateSummary(log)).toEqual('8x50.5\n7x45');
  });

  it('generates summary from a log with comments', () => {
    const log = {
      sets: [{ reps: 8, weight: 50.5 }, { reps: 7, weight: 45 }],
      comments: 'Testing comment.',
    };
    expect(generateSummary(log)).toEqual('8x50.5\n7x45\n\nTesting comment.');
  });
});
