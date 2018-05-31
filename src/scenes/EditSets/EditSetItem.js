/* @flow */

import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Divider, Text, withTheme } from 'react-native-paper';

import { extractSetIndexFromDatabase } from '../../database/utils';
import i18n from '../../utils/i18n';
import type { SetSchemaType } from '../../database/types';

type Props = {
  isSelected: boolean,
  onPressItem: (setId: string) => void,
  set: SetSchemaType,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class EditSetItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onPressItem(this.props.set.id);
  };

  render() {
    const { isSelected, set, theme } = this.props;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this._onPressItem}>
          <View
            style={[
              styles.item,
              isSelected && { backgroundColor: theme.colors.selected },
            ]}
          >
            <Text style={[styles.text, styles.index]}>
              {extractSetIndexFromDatabase(set.id)}.
            </Text>
            <Text style={[styles.text, styles.weight]}>
              {set.weight}{' '}
              <Text
                style={[styles.unit, { color: theme.colors.secondaryText }]}
              >
                {i18n.t('kg_unit', { count: set.weight })}{' '}
              </Text>
            </Text>
            <Text style={[styles.text, styles.reps]}>
              {set.reps}{' '}
              <Text
                style={[styles.unit, { color: theme.colors.secondaryText }]}
              >
                {i18n.t('reps_unit', { count: set.reps })}{' '}
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
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 18,
  },
  index: {
    flex: 0.2,
    paddingLeft: 16,
    textAlign: 'left',
  },
  weight: {
    flex: 0.25,
    paddingLeft: 16,
    textAlign: 'right',
  },
  reps: {
    flex: 0.25,
    paddingLeft: 24,
    textAlign: 'right',
  },
  unit: {
    fontSize: 14,
  },
});

export default withTheme(EditSetItem);
