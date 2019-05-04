/* @flow */
/* eslint-disable global-require */

import * as React from 'react';
import { render } from 'react-native-testing-library';

import WorkoutEmptyView from '../WorkoutEmptyView';
import {
  MockRealmArray,
  mockWorkouts,
} from '../../database/services/__tests__/helpers/databaseMocks';
import { whenIsTheDay } from '../../utils/date';
import { getAllWorkouts } from '../../database/services/WorkoutService';

jest.mock('../../database/services/WorkoutService', () => ({
  getAllWorkouts: jest.fn(() => new MockRealmArray()),
}));

jest.mock('../../utils/date');

describe('WorkoutEmptyView', () => {
  const _getEmptyView = (dayString: string) =>
    render(<WorkoutEmptyView dayString={dayString} />);

  it('renders past message', () => {
    // $FlowFixMe
    whenIsTheDay.mockImplementation(() => 'past');
    const { queryByText } = _getEmptyView('2019-05-06T00:00:00.000Z');
    expect(queryByText('Did you forget to log your training?')).not.toBeNull();
  });

  it('renders a future message', () => {
    // $FlowFixMe
    whenIsTheDay.mockImplementation(() => 'future');
    const { queryByText } = _getEmptyView('2019-05-06T00:00:00.000Z');
    expect(queryByText('Make sure to fulfill the future!')).not.toBeNull();
  });

  it('renders today message when no workouts', () => {
    // $FlowFixMe
    whenIsTheDay.mockImplementation(() => 'today');
    const { queryByText } = _getEmptyView('2019-05-06T00:00:00.000Z');
    expect(
      queryByText('Start logging your first workout right away!')
    ).not.toBeNull();
  });

  it('renders today message when there are workouts', () => {
    // $FlowFixMe
    getAllWorkouts.mockImplementation(
      () =>
        new MockRealmArray({
          mockWorkouts,
        })
    );
    // $FlowFixMe
    whenIsTheDay.mockImplementation(() => 'today');
    const { queryByText } = _getEmptyView('2019-05-06T00:00:00.000Z');

    // TODO make it better/deterministic by mocking Math.random
    expect(
      queryByText('Time to hit the gym!') ||
        queryByText("What's your excuse today?")
    ).not.toBeNull();
  });
});
