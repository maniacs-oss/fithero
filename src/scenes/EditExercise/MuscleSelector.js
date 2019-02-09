/* @flow */

import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';

import { muscleCategories } from '../../utils/muscles';
import MuscleItem from './MuscleItem';

type Props = {
  onValueChange: ({ [key: string]: boolean }) => void,
  muscles: { [key: string]: boolean },
  multiple: boolean,
};

class MuscleSelector extends React.Component<Props> {
  static defaultProps = {
    multiple: true,
  };

  _onMuscleChange = muscleId => {
    const { multiple, muscles } = this.props;

    let newValues = {};
    if (multiple) {
      newValues = {
        ...muscles,
        [muscleId]: muscles[muscleId] ? !muscles[muscleId] : true,
      };
    } else {
      newValues = {
        [muscleId]: muscles[muscleId] ? muscles[muscleId] : true,
      };
    }

    this.props.onValueChange(newValues);
  };

  render() {
    const { muscles } = this.props;
    const ItemComponent = this.props.multiple ? Checkbox : RadioButton;

    return (
      <FlatList
        data={muscleCategories}
        keyExtractor={item => item.id}
        numColumns={2}
        extraData={muscles}
        renderItem={({ item }) => (
          <MuscleItem
            key={item.id}
            muscle={item}
            checked={
              typeof muscles === 'string'
                ? muscles === item.id
                : !!muscles[item.id]
            }
            onValueChange={this._onMuscleChange}
            style={styles.item}
            render={props => (
              // $FlowFixMe value in RadioButton is required
              <ItemComponent status={props.checked ? 'checked' : 'unchecked'} />
            )}
          />
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: '50%',
  },
});

export default MuscleSelector;
