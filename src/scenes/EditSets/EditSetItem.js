/* @flow */

import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../../utils/i18n';
import type { WorkoutSetSchemaType } from '../../database/types';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';

type Props = {
  isSelected: boolean,
  isMaxSet: boolean,
  onPressItem: (setId: string) => void,
  index: number,
  set: WorkoutSetSchemaType,
  theme: ThemeType,
};

class EditSetItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onPressItem(this.props.set.id);
  };

  render() {
    const { index, isSelected, isMaxSet, set, theme } = this.props;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this._onPressItem}>
          <View
            style={[
              styles.item,
              isSelected && { backgroundColor: theme.colors.selected },
            ]}
          >
            <Text style={[styles.text, styles.index]}>{index}.</Text>
            <Icon
              name="trophy"
              size={24}
              color={theme.colors.trophy}
              style={[styles.icon, !isMaxSet && { opacity: 0 }]}
            />
            <Text style={[styles.text, styles.weight]}>
              {set.weight}{' '}
              <Text
                style={[styles.unit, { color: theme.colors.secondaryText }]}
              >
                {i18n.t('kg.unit', { count: set.weight })}{' '}
              </Text>
            </Text>
            <Text style={[styles.text, styles.reps]}>
              {set.reps}{' '}
              <Text
                style={[styles.unit, { color: theme.colors.secondaryText }]}
              >
                {i18n.t('reps.unit', { count: set.reps })}{' '}
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Divider />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 36,
  },
  text: {
    fontSize: 18,
  },
  index: {
    textAlign: 'left',
  },
  icon: {
    marginHorizontal: 24,
    height: 24,
    width: 24,
  },
  weight: {
    flex: 0.5,
    textAlign: 'right',
  },
  reps: {
    flex: 0.5,
    paddingLeft: 16,
    textAlign: 'right',
  },
  unit: {
    fontSize: 14,
  },
});

export default withTheme(EditSetItem);
