/* @flow */

import React from 'react';
import { shallow } from 'enzyme';
import { Keyboard } from 'react-native';
import { exercises } from 'dziku-exercises';

import { ExercisesScreen } from '../ExercisesScreen';
import theme from '../../../utils/theme';

class RealmResults extends Array<*> {
  addListener = jest.fn();
  removeAllListeners = jest.fn();
}

const mockRealmResults = new RealmResults();

jest.mock('Platform', () => ({ OS: 'android', select: jest.fn() }));
jest.mock('Keyboard');
jest.mock('../../../database/services/ExerciseService', () => ({
  getAllExercises: () => mockRealmResults,
}));

describe('ExercisesScreen', () => {
  const wrapper = shallow(
    <ExercisesScreen
      navigation={{
        addListener: jest.fn(),
        state: { params: { day: '21/10/2018' } },
        goBack: jest.fn(),
        setParams: jest.fn(),
        navigate: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
      }}
      theme={theme}
    />
  );
  const List = wrapper.find('FlatList');

  const state = wrapper.state();
  const createState = (searchQuery, tagSelection) => ({
    ...state,
    ...{
      searchQuery,
      tagSelection: {
        ...state.tagSelection,
        ...tagSelection,
      },
    },
  });

  it('shows all exercises if no filters', () => {
    expect(List.props().data).toHaveLength(exercises.length);
  });

  it('filters by search query', () => {
    const data = wrapper
      .instance()
      ._getData('Barbell Squat', wrapper.state().tagSelection);

    expect(data.find(e => e.id === 'barbell-squat')).toBeDefined();
  });

  it('filters by tag', () => {
    const newState = createState('', { core: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);
    const filteredExercises = exercises.filter(e => e.primary[0] === 'abs');

    expect(data).toEqual(filteredExercises);
  });

  it('filters by search and tag - match', () => {
    const newState = createState('Air bike', { core: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);

    expect(data).toEqual([
      expect.objectContaining({
        id: 'air-bike',
        primary: ['abs'],
        secondary: [],
      }),
    ]);
  });

  it('filters by search and tag - no match', () => {
    const newState = createState('Air bike', { legs: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);

    expect(data).toEqual([]);
  });

  it('filters by search escaping special characters', () => {
    const newState = createState('Bench Press: Barbell (Decline)', {});

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);

    expect(
      data.find(e => e.id === 'decline-barbell-bench-press')
    ).toBeDefined();
  });

  it('pushes a new screen when clicking an exercise and dismiss the keyboard', () => {
    expect(Keyboard.dismiss).not.toHaveBeenCalled();
    wrapper.instance()._onExercisePress('bench-press');
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});
