/* @flow */

import * as React from 'react';
import { View } from 'react-native';
import { Caption } from 'react-native-paper';

import { dateToString, getDatePrettyFormat, getToday } from '../../utils/date';

type Props = {
  day: string,
  style?: View.propTypes.style,
};

class ExerciseHeader extends React.PureComponent<Props> {
  render() {
    const dayString = getDatePrettyFormat(
      this.props.day,
      dateToString(getToday())
    );
    return <Caption style={this.props.style}>{dayString}</Caption>;
  }
}

export default ExerciseHeader;
