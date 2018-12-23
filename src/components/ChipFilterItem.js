/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import type { CategoryType } from '../types';
import withTheme from '../utils/theme/withTheme';

type Props = {
  item: CategoryType,
  onSelect: string => void,
  selected: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class ChipFilterItem extends React.PureComponent<Props> {
  _onSelect = () => {
    this.props.onSelect(this.props.item.id);
  };

  render() {
    const {
      item,
      selected,
      theme: { colors },
    } = this.props;
    const backgroundColor = selected ? colors.chipSelected : colors.chip;

    return (
      <Chip
        key={item.id}
        onPress={this._onSelect}
        selected={selected}
        style={[styles.chip, { backgroundColor }]}
      >
        {item.name}
      </Chip>
    );
  }
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
  },
});

export default withTheme(ChipFilterItem);
