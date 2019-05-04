/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import withTheme from '../utils/theme/withTheme';
import type { NavigationType } from '../types';
import type { ThemeType } from '../utils/theme/withTheme';

type Props = {
  comments: string,
  day: string,
  navigation: NavigationType<{ day: string }>,
  theme: ThemeType,
};

class WorkoutComments extends React.Component<Props> {
  _addWorkoutComment = () => {
    this.props.navigation.navigate('Comments', { day: this.props.day });
  };

  render() {
    const { comments } = this.props;
    const { colors } = this.props.theme;

    return (
      <Card style={styles.comments} onPress={this._addWorkoutComment}>
        <Card.Content>
          <Text style={{ color: colors.secondaryText }}>{comments}</Text>
        </Card.Content>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  comments: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default withTheme(withNavigation(WorkoutComments));
