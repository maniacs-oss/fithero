/* @flow */

import React from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EditSetItem from '../EditSetItem';
import { toDate } from '../../../utils/date';
import theme from '../../../utils/theme';

describe('EditSetItem', () => {
  const getWrapper = props =>
    TestRenderer.create(
      <EditSetItem
        isSelected={false}
        isMaxSet={false}
        onPressItem={jest.fn()}
        index={0}
        set={{
          id: '2018-05-04T00:00:00.000Z_bench-press_001',
          reps: 7,
          weight: 70,
          date: toDate('2018-05-04T00:00:00.000Z'),
          type: 'bench-press',
        }}
        theme={theme}
        {...props}
      />
    ).root;

  it('shows the set selected if is set is isSelected', () => {
    expect(
      getWrapper({ isSelected: true }).findAllByType(View)[1].props.style
    ).toContainEqual({ backgroundColor: theme.colors.selected });

    expect(
      getWrapper({ isSelected: false }).findAllByType(View)[1].props.style
    ).not.toContainEqual({ backgroundColor: theme.colors.selected });
  });

  it('shows a trophy if set is maxSetId', () => {
    expect(
      getWrapper({ isMaxSet: false }).findByType(Icon).props.style
    ).toContainEqual({ opacity: 0 });

    expect(
      getWrapper({ isMaxSet: true }).findByType(Icon).props.style
    ).not.toContainEqual({ opacity: 0 });
  });
});
