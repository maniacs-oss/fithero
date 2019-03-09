/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import i18n from '../../utils/i18n';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

type Props = {
  onPress: () => void,
  selected: string,
  title: string,
  theme: ThemeType,
};

class PreferenceItem extends React.PureComponent<Props> {
  render() {
    const { onPress, selected, title } = this.props;
    const { colors } = this.props.theme;

    return (
      <TouchableRipple onPress={onPress}>
        <View style={styles.content}>
          <View>
            <Text style={[styles.body, styles.title]}>{title}</Text>
          </View>
          <View>
            <Text
              style={[
                styles.body,
                styles.secondary,
                { color: colors.secondaryText },
              ]}
            >
              {i18n.t(selected)}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    minHeight: 64,
    paddingHorizontal: 16,
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
