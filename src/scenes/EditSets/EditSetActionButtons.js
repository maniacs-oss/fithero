/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import i18n from '../../utils/i18n';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';

type Props = {
  isUpdate: boolean,
  onAddSet: () => void,
  onDeleteSet: () => void,
  theme: ThemeType,
};

class EditSetActionButtons extends React.Component<Props> {
  render() {
    const { isUpdate, theme } = this.props;

    return (
      <View style={styles.controls}>
        <Button
          onPress={this.props.onAddSet}
          color={theme.colors.text}
          style={[styles.button, styles.confirm]}
        >
          {i18n.t(isUpdate ? 'update' : 'add')}
        </Button>
        <Button
          onPress={this.props.onDeleteSet}
          color={theme.colors.text}
          disabled={!isUpdate}
          style={[styles.button, styles.delete]}
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
