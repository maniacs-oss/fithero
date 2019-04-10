/* @flow */

import { generateSummary, parseSummary } from '../exercisePaper';
import { toDate } from '../date';

const date = toDate('2018-05-01T00:00:00.000Z');

describe('parseSummary', () => {
  it('parses a summary case', () => {
    const summary = `
  8x100
  8x110
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 8,
          weight: 100,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_002',
          reps: 8,
          weight: 110,
          date,
          type: 'bench-press',
        },
      ],
    });
  });

  it('parses a summary case with extra numbers and x', () => {
    const summary = `
  Ignore text
  10x100x2
  
  
  
  
  
  8x110
  7x120
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 10,
          weight: 100,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_002',
          reps: 8,
          weight: 110,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_003',
          reps: 7,
          weight: 120,
          date,
          type: 'bench-press',
        },
      ],
    });
  });

  it('parses a valid summary case with decimals in weight', () => {
    const summary = `
  10x50.35
  8x20.25
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 10,
          weight: 50.35,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_002',
          reps: 8,
          weight: 20.25,
          date,
          type: 'bench-press',
        },
      ],
    });
  });

  it('avoid sets with 0 repetitions', () => {
    const summary = `
  0x50
  5x50
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 5,
          weight: 50,
          date,
          type: 'bench-press',
        },
      ],
    });
  });

  it('fixes whitespaces inside sets', () => {
    const summary = `
  8x 50
  10 x50
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 8,
          weight: 50,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_002',
          reps: 10,
          weight: 50,
          date,
          type: 'bench-press',
        },
      ],
    });
  });

  it('ignores trailing zeros', () => {
    const summary = `
  08x0100
  09x0110.5
  `;

    const result = parseSummary(
      summary,
      '2018-05-01T00:00:00.000Z',
      'bench-press'
    );
    expect(result).toEqual({
      sets: [
        {
          id: '20180501_bench-press_001',
          reps: 8,
          weight: 100,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_002',
          reps: 9,
          weight: 110.5,
          date,
          type: 'bench-press',
        },
      ],
    });
  });
});

describe('generateSummary', () => {
  it('generates summary from a log with one set', () => {
    const log = {
      sets: [
        {
          id: '20180501_bench-press_000',
          reps: 10,
          weight: 50.5,
          date,
          type: 'bench-press',
        },
      ],
    };
    expect(generateSummary(log, 'metric')).toEqual('10x50.5');
  });

  it('generates summary from a log', () => {
    const log = {
      sets: [
        {
          id: '20180501_bench-press_000',
          reps: 8,
          weight: 50.5,
          date,
          type: 'bench-press',
        },
        {
          id: '20180501_bench-press_001',
          reps: 7,
          weight: 45,
          date,
          type: 'bench-press',
        },
      ],
    };
    expect(generateSummary(log, 'metric')).toEqual('8x50.5\n7x45');
  });
});
