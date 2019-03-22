/* @flow */

import * as React from 'react';
import { render } from 'react-native-testing-library';

import { getToday, toDate } from '../../../utils/date';
import HomeScreen from '../HomeScreen';
import { Provider } from 'react-redux';
import store from '../../../redux/configureStore';

const dateString = '2018-05-22T00:00:00.000Z';
const dateStringLater = '2018-05-23T00:00:00.000Z';

const mockWorkouts = [
  {
    id: dateString,
    date: toDate(dateString),
    comments: 'Testing comment.',
    exercises: [],
    isValid: jest.fn(),
  },
  {
    id: dateStringLater,
    date: toDate(dateStringLater),
    exercises: [],
    isValid: jest.fn(),
  },
];

jest.mock('../../../components/DataProvider', () => props =>
  props.render({
    [mockWorkouts[0].id]: mockWorkouts[0],
    [mockWorkouts[1].id]: mockWorkouts[1],
  })
);
jest.mock('../../../utils/date', () => {
  const actualDate = jest.requireActual('../../../utils/date');
  return {
    ...actualDate,
    getToday: jest.fn(),
  };
});

describe('HomeScreen', () => {
  const _getRender = () => {
    return render(
      <Provider store={store}>
        <HomeScreen
          firstDayOfTheWeek="monday"
          navigation={{ setParams: jest.fn() }}
        />
      </Provider>
    );
  };

  it('render comments if the workout has them', () => {
    // $FlowFixMe
    getToday.mockImplementation(() => '2018-05-22T00:00:00.000Z');
    const { getByText } = _getRender();

    expect(getByText(mockWorkouts[0].comments)).toBeDefined();
  });

  it('does not render comments if the workout does not have them', () => {
    // $FlowFixMe
    getToday.mockImplementation(() => '2018-05-23T00:00:00.000Z');
    const { queryByText } = _getRender();

    expect(queryByText(mockWorkouts[0].comments)).toBeNull();
  });
});
