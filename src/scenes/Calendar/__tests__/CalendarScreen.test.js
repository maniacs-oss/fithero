/* @flow */

import React from 'react';
import { shallow } from 'enzyme';

import { CalendarScreen } from '../CalendarScreen';
import theme from '../../../utils/theme';

// Call it immediately
global.requestAnimationFrame = jest.fn(cb => cb());

test('remove realm listeners on unmounting', () => {
  const wrapper = shallow(
    <CalendarScreen
      navigation={{
        addListener: jest.fn(),
        state: { params: { today: '07/10/2018' } },
        setParams: jest.fn(),
        navigate: jest.fn(),
        push: jest.fn(),
        goBack: jest.fn(),
        dispatch: jest.fn(),
      }}
      firstDay={0}
      theme={theme}
    />
  );
  const addListener = wrapper.instance().workoutsListener.addListener;
  const removeAllListeners = wrapper.instance().workoutsListener
    .removeAllListeners;

  expect(addListener).toHaveBeenCalledTimes(1);
  expect(removeAllListeners).toHaveBeenCalledTimes(0);

  wrapper.unmount();

  expect(removeAllListeners).toHaveBeenCalledTimes(1);
});
