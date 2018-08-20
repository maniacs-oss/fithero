/* @flow */

import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Caption } from 'react-native-paper';

import i18n from '../utils/i18n';
import ChipFilterItem from './ChipFilterItem';
import type { CategoryType } from '../types';

type Props = {
  items: Array<CategoryType>,
  onSelect: string => void,
  selection: { [id: string]: boolean },
  titleKey?: string,
};

class ChipsCategory extends React.Component<Props> {
  render() {
    const { items, onSelect, selection, titleKey } = this.props;
    return (
      <View style={styles.container}>
        {titleKey && <Caption style={styles.title}>{i18n.t(titleKey)}</Caption>}
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.row}>
            {items.map(m => (
              <ChipFilterItem
                key={m.id}
                item={m}
                onSelect={onSelect}
                selected={selection[m.id]}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  title: {
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

export default ChipsCategory;
