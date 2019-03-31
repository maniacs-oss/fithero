/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

type Props = {
  onPress: () => mixed,
  title: string,
  description?: string,
  theme: ThemeType,
  selected?: string,
  entries?: { [key: string]: string },
};

class PreferenceItem extends React.PureComponent<Props> {
  render() {
    const { description, onPress, selected, title, entries } = this.props;
    const { colors } = this.props.theme;

    let secondaryText = description;
    if (!secondaryText && entries && selected) {
      secondaryText = entries[selected];
    }

    return (
      <TouchableRipple onPress={onPress}>
        <View style={styles.content}>
          <Text style={[styles.body, styles.title]}>{title}</Text>
          {secondaryText && (
            <Text
              style={[
                styles.body,
                styles.secondary,
                { color: colors.secondaryText },
              ]}
            >
              {secondaryText}
            </Text>
          )}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  body: {
    paddingBottom: 2,
  },
  title: {
    fontSize: 16,
  },
  secondary: {
    fontSize: 15,
  },
});

export default withTheme(PreferenceItem);
