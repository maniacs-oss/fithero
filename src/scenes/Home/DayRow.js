/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import DayItem from './DayItem';
import {
  dateToString,
  getDatePrettyFormat,
  getToday,
  isSameDay,
} from '../../utils/date';
import type { WorkoutSchemaType } from '../../database/types';

type Props = {
  currentWeek: Array<Date>,
  onDaySelected: string => void,
  selected: string,
  workouts: { [date: string]: WorkoutSchemaType },
};

class DayRow extends React.Component<Props> {
  _onDaySelected = dateString => {
    this.props.onDaySelected(dateString);
  };

  _renderDays() {
    return this.props.currentWeek.map(d => {
      const isSelected = isSameDay(d, this.props.selected);
      const dateString = dateToString(d);
      return (
        <DayItem
          key={dateString}
          dateString={dateString}
          isSelected={isSelected}
          onDaySelected={this._onDaySelected}
          isWorkout={!!this.props.workouts[dateString]}
        />
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <Text style={styles.title}>
          {getDatePrettyFormat(this.props.selected, dateToString(getToday()))}
        </Text>
        <View style={styles.row}>{this._renderDays()}</View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 15,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
});

export default DayRow;
