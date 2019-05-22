/* @flow */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { TextInput } from 'react-native-paper';

import { EditExerciseScreen } from '../EditExerciseScreen';
import theme from '../../../utils/theme';

jest.mock('NativeAnimatedHelper'); // Warning from useNativeDriver
jest.useFakeTimers(); // Issues with Animated

it('handles validation errors', () => {
  const renderer = TestRenderer.create(
    <EditExerciseScreen
      exercise={null}
      navigation={{
        setParams: jest.fn(),
        addListener: jest.fn(),
        state: { params: { onSave: jest.fn() } },
        navigate: jest.fn(),
        push: jest.fn(),
        goBack: jest.fn(),
        dispatch: jest.fn(),
      }}
      theme={theme}
    />
  );
  const testInstance = renderer.root;

  const nameInput = testInstance.findAllByType(TextInput)[0];
  const muscleContainer = testInstance.findByProps({
    testID: 'muscle-container',
  });
  const muscleLabel = testInstance.findByProps({ testID: 'muscle-label' });

  expect(nameInput.props.error).toBe(false);
  expect(muscleContainer.props.style[1].borderColor).toEqual(
    theme.colors.placeholder
  );
  expect(muscleLabel.props.style[1].color).toEqual(theme.colors.placeholder);

  renderer.getInstance()._onSave();

  expect(nameInput.props.error).toBe(true);
  expect(muscleContainer.props.style[1].borderColor).toEqual(
    theme.colors.error
  );
  expect(muscleLabel.props.style[1].color).toEqual(theme.colors.error);
});
