/* @flow */

import * as React from 'react';
import { render } from 'react-native-testing-library';
import moment from 'moment';

import DayRow from '../DayRow';
import {
  getCurrentWeek,
  setMomentFirstDayOfTheWeek,
} from '../../../utils/date';

describe('DayRow', () => {
  const getRender = (day: string) => {
    const currentWeek = getCurrentWeek(moment(day).startOf('day'));
    return render(
      <DayRow
        currentWeek={currentWeek}
        workouts={{}}
        onDaySelected={jest.fn()}
        selected={day}
      />
    );
  };

  setMomentFirstDayOfTheWeek('en', 0, true);
  const { toJSON: mondayJSON } = getRender('2019-03-18T00:00:00.000Z');

  it('day row starts on Monday or Sunday', () => {
    setMomentFirstDayOfTheWeek('en', 1, true);
    const { toJSON: sundayJSON } = getRender('2019-03-17T00:00:00.000Z');

    // $FlowFixMe
    expect(mondayJSON()).toMatchDiffSnapshot(sundayJSON(), {
      contextLines: 0,
      stablePatchmarks: true,
    });
  });

  it('day row starts on Monday or Saturday', () => {
    setMomentFirstDayOfTheWeek('en', 6, true);
    const { toJSON: saturdayJSON } = getRender('2019-03-16T00:00:00.000Z');

    // $FlowFixMe
    expect(mondayJSON()).toMatchDiffSnapshot(saturdayJSON(), {
      contextLines: 0,
      stablePatchmarks: true,
    });
  });
});
