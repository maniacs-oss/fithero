/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { getShortDayInfo } from '../../utils/date';

type Props = {
  dateString: string,
  onDaySelected: (dateString: string) => void,
  isSelected: boolean,
};

class DayItem extends React.PureComponent<Props> {
  static defaultProps = {
    isSelected: false,
  };

  _onSelected = () => {
    this.props.onDaySelected(this.props.dateString);
  };

  render() {
    const { dateString, isSelected } = this.props;
    const { date, day } = getShortDayInfo(dateString);

    return (
      <TouchableRipple onPress={this._onSelected}>
        <View style={[styles.container, isSelected && styles.selected]}>
          <Text style={[styles.text, styles.textTop]}>{date}</Text>
          <Text style={[styles.text, styles.textBottom]}>{day}</Text>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.4,
    height: 56,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    opacity: 1,
  },
  text: {
    fontSize: 14,
  },
  textTop: {
    paddingBottom: 1,
  },
  textBottom: {
    paddingTop: 1,
  },
});

export default DayItem;
