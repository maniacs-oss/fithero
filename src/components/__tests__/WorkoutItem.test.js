/* @flow */
/* eslint-disable global-require */

import * as React from 'react';
import { render } from 'react-native-testing-library';

import WorkoutItem from '../WorkoutItem';
import {
  getMockExercises,
  mockMultipleSets,
  MockRealmArray,
  RealmArray,
} from '../../database/services/__tests__/helpers/databaseMocks';
import { getMaxSetByType } from '../../database/services/WorkoutSetService';
import theme from '../../utils/theme';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

jest.mock('../../database/services/WorkoutSetService', () => ({
  getMaxSetByType: jest.fn(() => new MockRealmArray()),
}));

describe('WorkoutItem', () => {
  const mockExercise = getMockExercises(mockMultipleSets)[0];
  const _getWorkout = (
    Component: typeof WorkoutItem,
    weightSystem?: DefaultUnitSystemType
  ) =>
    render(
      <Component
        defaultUnitSystem={weightSystem || 'metric'}
        exercise={mockExercise}
        onPressItem={jest.fn()}
        theme={theme}
      />
    );

  it('renders using kg vs lb', () => {
    const {
      queryAllByText: queryAllByTextMetric,
      toJSON: metricJSON,
    } = _getWorkout(WorkoutItem);
    const {
      queryAllByText: queryAllByTextImperial,
      toJSON: imperialJSON,
    } = _getWorkout(WorkoutItem, 'imperial');

    // $FlowFixMe
    expect(metricJSON()).toMatchDiffSnapshot(imperialJSON(), {
      contextLines: 0,
    });

    expect(queryAllByTextMetric(`18 reps`)).toHaveLength(1);
    expect(queryAllByTextMetric(`15 reps`)).toHaveLength(1);
    expect(queryAllByTextImperial(`18 reps`)).toHaveLength(1);
    expect(queryAllByTextImperial(`15 reps`)).toHaveLength(1);
  });

  it('renders in special color if the set is your max set', () => {
    // $FlowFixMe
    getMaxSetByType.mockImplementation(
      () => new RealmArray({ ...mockMultipleSets[0] })
    );
    const WorkoutItemWithMax = require('../WorkoutItem').default;
    const { toJSON: maxJSON } = _getWorkout(WorkoutItemWithMax);

    // $FlowFixMe
    getMaxSetByType.mockImplementation(() => new RealmArray());
    const WorkoutItemWithoutMax = require('../WorkoutItem').default;
    const { toJSON: noMaxJSON } = _getWorkout(WorkoutItemWithoutMax);

    // $FlowFixMe
    expect(maxJSON()).toMatchDiffSnapshot(noMaxJSON(), {
      contextLines: 0,
    });
  });
});
