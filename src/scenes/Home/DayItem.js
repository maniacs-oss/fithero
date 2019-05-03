/* @flow */

import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { getShortDayInfo, isAfter } from '../../utils/date';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

const { width } = Dimensions.get('window');

type Props = {
  dateString: string,
  onDaySelected: (dateString: string) => void,
  isSelected: boolean,
  isWorkout: boolean,
  theme: ThemeType,
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
    const after = isAfter(dateString);
    const textColor = {
      color: !after ? theme.colors.text : theme.colors.text,
    };

    return (
      <TouchableRipple onPress={this._onSelected} testID="day-touchable">
        <View style={styles.container}>
          <View
            style={[
              styles.textContainer,
              after && styles.future,
              isSelected && styles.selected,
            ]}
            testID="day-text-container"
          >
            <Text style={[styles.text, styles.textTop, textColor]}>{date}</Text>
            <Text style={[styles.text, styles.textBottom, textColor]}>
              {day}
            </Text>
          </View>
          <View style={styles.dots}>
            {isWorkout && (
              <View
                style={[styles.dot, { backgroundColor: theme.colors.accent }]}
                testID="day-dot"
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
    // Subtract the padding part on each item
    width: width / 7 - 16 / 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    opacity: 0.5,
  },
  future: {
    opacity: 0.15,
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
