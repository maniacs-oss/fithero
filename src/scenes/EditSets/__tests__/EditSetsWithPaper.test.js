/* @flow */

/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-native-testing-library';
import TestRenderer from 'react-test-renderer';

import { EditSetsWithPaper } from '../EditSetsWithPaper';
import i18n from '../../../utils/i18n';
import theme from '../../../utils/theme';
import { toDate } from '../../../utils/date';
import {
  addExercise,
  updateExercisePaperForWorkout,
} from '../../../database/services/WorkoutExerciseService';

import type { AddWorkoutExerciseSchemaType } from '../../../database/types';
import { generateSummary } from '../../../utils/exercisePaper';

const dateString = '2018-05-04T00:00:00.000Z';
const date = toDate('2018-05-04T00:00:00.000Z');

const remove = jest.fn();
const addListener = jest.fn(() => ({
  remove,
}));

jest.mock('../../../database/services/WorkoutExerciseService');

const getComponent = (exercise: ?AddWorkoutExerciseSchemaType) => (
  <EditSetsWithPaper
    day={dateString}
    exerciseKey={'bench-press'}
    exercise={exercise ? { sort: 1, isValid: jest.fn(), ...exercise } : null}
    exercisesCount={0}
    navigation={{
      addListener,
      state: { params: { day: '05/04/2018', exerciseKey: 'bench-press' } },
      goBack: jest.fn(),
      setParams: jest.fn(),
      navigate: jest.fn(),
      push: jest.fn(),
      dispatch: jest.fn(),
    }}
    theme={theme}
    defaultUnitSystem="metric"
  />
);

const mockExercise = {
  id: `20180504_bench-press`,
  sets: [
    {
      id: `20180504_bench-press_001`,
      reps: 6,
      weight: 100,
      date,
      type: 'bench-press',
    },
    {
      id: `20180504_bench-press_002`,
      reps: 5,
      weight: 100,
      date,
      type: 'bench-press',
    },
  ],
  date,
  type: 'bench-press',
  weight_unit: 'metric',
};

it('handles willBlur subscription properly', () => {
  // $FlowFixMe Jest vs Flow
  console.warn = jest.fn();
  const { unmount } = render(getComponent(null));
  expect(addListener.mock.calls[0][0]).toEqual('willBlur');
  unmount();
  expect(remove).toHaveBeenCalledTimes(1);
});

it('renders an empty placeholder text if there is no exercise', () => {
  const { queryByPlaceholder, getByType } = render(getComponent(null));
  const textInput = getByType('TextInput');

  expect(
    queryByPlaceholder(i18n.t('exercise__paper-placeholder'))
  ).not.toBeNull();
  expect(textInput.props.value).toEqual('');
});

it('renders the summary if there is an exercise', () => {
  const { queryByText, getByType } = render(getComponent(mockExercise));

  const summary = `6x100
5x100`;

  expect(queryByText('Bench Press: Barbell')).not.toBeNull();
  expect(queryByText('2 sets')).not.toBeNull();
  expect(getByType('TextInput').props.value).toEqual(summary);
});

describe('saving sets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it does not call any saving function on saveSet if no exercise', () => {
    const component = TestRenderer.create(getComponent(null));

    component.getInstance()._saveSets();
    expect(addExercise).not.toBeCalled();
    expect(updateExercisePaperForWorkout).not.toBeCalled();
  });

  it('it calls updateExercisePaperForWorkout if exercise was already there', () => {
    const component = TestRenderer.create(getComponent(mockExercise));

    component.getInstance()._saveSets();
    expect(addExercise).not.toBeCalled();
    expect(updateExercisePaperForWorkout).toBeCalledWith({
      ...mockExercise,
    });
  });

  it('it calls addExercise if there was no exercise and we have a summary', () => {
    const component = TestRenderer.create(getComponent(null));

    component.getInstance().setState({
      exerciseSummary: generateSummary(
        {
          sets: mockExercise.sets,
        },
        'metric'
      ),
      numberOfSets: mockExercise.sets.length,
    });

    component.getInstance()._saveSets();
    expect(addExercise).toBeCalledWith({
      ...mockExercise,
    });
    expect(updateExercisePaperForWorkout).not.toBeCalled();
  });
});
