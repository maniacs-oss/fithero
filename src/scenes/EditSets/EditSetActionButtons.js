/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, withTheme } from 'react-native-paper';

import i18n from '../../utils/i18n';

type Props = {
  isUpdate: boolean,
  onAddSet: () => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class EditSetActionButtons extends React.Component<Props> {
  render() {
    const { isUpdate, theme } = this.props;

    return (
      <View style={styles.controls}>
        <Button
          onPress={this.props.onAddSet}
          raised
          style={[
            styles.button,
            styles.confirm,
            { backgroundColor: theme.colors.confirm },
          ]}
        >
          {i18n.t(isUpdate ? 'update' : 'add')}
        </Button>
        <Button
          onPress={() => {}}
          disabled
          raised
          style={[
            styles.button,
            styles.delete,
            { backgroundColor: theme.colors.delete },
          ]}
        >
          {i18n.t('delete')}
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
  },
  button: {
    margin: 8,
  },
  confirm: {
    flex: 0.7,
  },
  delete: {
    flex: 0.3,
  },
});

export default withTheme(EditSetActionButtons);
