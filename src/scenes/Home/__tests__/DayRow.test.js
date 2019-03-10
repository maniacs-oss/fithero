/* @flow */

import * as React from 'react';
import { render } from 'react-native-testing-library';
import moment from 'moment';

import DayRow from '../DayRow';
import { getCurrentWeek } from '../../../utils/date';
import type { FirstDayOfTheWeekType } from '../../../redux/modules/settings';

describe('DayRow', () => {
  const getRender = (day: string, firstDayOfTheWeek: FirstDayOfTheWeekType) => {
    const currentWeek = getCurrentWeek(
      moment(day).startOf('day'),
      firstDayOfTheWeek
    );
    return render(
      <DayRow
        currentWeek={currentWeek}
        workouts={{}}
        onDaySelected={jest.fn()}
        selected={day}
      />
    );
  };

  const { toJSON: mondayJSON } = getRender(
    '2019-03-18T00:00:00.000Z',
    'monday'
  );

  it('day row starts on Monday or Sunday', () => {
    const { toJSON: sundayJSON } = getRender(
      '2019-03-17T00:00:00.000Z',
      'sunday'
    );

    // $FlowFixMe
    expect(mondayJSON()).toMatchDiffSnapshot(sundayJSON(), {
      contextLines: 0,
    });
  });

  it('day row starts on Monday or Saturday', () => {
    const { toJSON: saturdayJSON } = getRender(
      '2019-03-16T00:00:00.000Z',
      'saturday'
    );

    // $FlowFixMe
    expect(mondayJSON()).toMatchDiffSnapshot(saturdayJSON(), {
      contextLines: 0,
    });
  });
});
