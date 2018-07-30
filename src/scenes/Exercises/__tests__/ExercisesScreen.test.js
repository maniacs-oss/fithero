/* @flow */

import React from 'react';
import { shallow } from 'enzyme';

import exercises from '../../../data/exercises.json';
import { ExercisesScreen } from '../ExercisesScreen';
import theme from '../../../utils/theme';

describe('ExercisesScreen', () => {
  const wrapper = shallow(
    <ExercisesScreen
      navigation={{
        state: { params: { day: '21/10/2018' } },
        goBack: jest.fn(),
        setParams: jest.fn(),
        navigate: jest.fn(),
        push: jest.fn(),
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
    expect(List.props().data.length).toEqual(exercises.length);
  });

  it('filters by search query', () => {
    const data = wrapper
      .instance()
      ._getData('Barbell Squat', wrapper.state().tagSelection);

    expect(data).toEqual([
      {
        id: 'barbell-squat',
        primary: ['quadriceps'],
        secondary: ['hamstrings'],
      },
    ]);
  });

  it('filters by tag', () => {
    const newState = createState('', { core: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);
    const filteredExercises = exercises.filter(e => e.primary[0] === 'abs');

    expect(data).toEqual(filteredExercises);
  });

  it('filters by several tags', () => {
    const newState = createState('', { back: true, core: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);
    const filteredExercises = exercises.filter(e => {
      for (let i = 0; i < e.primary.length; i++) {
        switch (e.primary[i]) {
          case 'abs':
          case 'back':
          case 'lats':
          case 'traps':
            return true;
          default:
        }
      }
      return false;
    });

    expect(data).toEqual(filteredExercises);
  });

  it('filters by search and tag - match', () => {
    const newState = createState('Air bike', { core: true });

    const data = wrapper
      .instance()
      ._getData(newState.searchQuery, newState.tagSelection);

    expect(data).toEqual([
      {
        id: 'air-bike',
        primary: ['abs'],
        secondary: [],
      },
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

    expect(data).toEqual([
      {
        id: 'decline-barbell-bench-press',
        primary: ['chest'],
        secondary: ['triceps', 'shoulders'],
      },
    ]);
  });
});
