/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/src/types';

import { getShortDayInfo } from '../../utils/date';

type Props = {
  dateString: string,
  onDaySelected: (dateString: string) => void,
  isSelected: boolean,
  isWorkout: boolean,
  theme: Theme,
};

class DayItem extends React.PureComponent<Props> {
  static defaultProps = {
    isSelected: false,
  };

  _onSelected = () => {
    this.props.onDaySelected(this.props.dateString);
  };

  render() {
    const { dateString, isSelected, isWorkout, theme } = this.props;
    const { date, day } = getShortDayInfo(dateString);

    return (
      <TouchableRipple onPress={this._onSelected}>
        <View style={styles.container}>
          <View style={[styles.textContainer, isSelected && styles.selected]}>
            <Text style={[styles.text, styles.textTop]}>{date}</Text>
            <Text style={[styles.text, styles.textBottom]}>{day}</Text>
          </View>
          <View style={styles.dots}>
            {isWorkout && (
              <View
                style={[styles.dot, { backgroundColor: theme.colors.primary }]}
              />
            )}
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    opacity: 0.4,
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
  dots: {
    height: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 2,
  },
});

export default withTheme(DayItem);
