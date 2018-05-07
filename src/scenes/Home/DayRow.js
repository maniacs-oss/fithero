/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import DayItem from './DayItem';
import {
  dateToString,
  getCurrentWeek,
  getDatePrettyFormat,
  getToday,
  isSameDay,
} from '../../utils/date';

type Props = {
  onDaySelected: string => void,
  selected: string,
};

class DayRow extends React.Component<Props> {
  _onDaySelected = dateString => {
    this.props.onDaySelected(dateString);
  };

  _renderDays() {
    const days = getCurrentWeek(new Date());
    return days.map(d => {
      const isSelected = isSameDay(d, this.props.selected);
      const dateString = dateToString(d);
      return (
        <DayItem
          key={dateString}
          dateString={dateString}
          isSelected={isSelected}
          onDaySelected={this._onDaySelected}
        />
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <Text style={styles.title}>
          {getDatePrettyFormat(this.props.selected, getToday())}
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
