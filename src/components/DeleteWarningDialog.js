/* @flow */

import * as React from 'react';
import {
  Button,
  DefaultTheme,
  Dialog,
  Paragraph,
  Portal,
} from 'react-native-paper';

import i18n from '../utils/i18n';
import withTheme from '../utils/theme/withTheme';
import type { ThemeType } from '../utils/theme/withTheme';

type Props = {
  description: string,
  title?: string,
  onConfirm: () => void,
  onDismiss: () => void,
  visible: boolean,
  theme: ThemeType,
};

class DeleteWarningDialog extends React.Component<Props> {
  render() {
    const { description, title, onConfirm, onDismiss, visible } = this.props;
    const { colors } = this.props.theme;

    const dialogTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
      },
    };

    return (
      <Portal>
        <Dialog visible={visible} theme={dialogTheme} onDismiss={onDismiss}>
          {title && <Dialog.Title>{title}</Dialog.Title>}
          <Dialog.Content>
            <Paragraph>{description}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>{i18n.t('cancel')}</Button>
            <Button onPress={onConfirm}>{i18n.t('delete')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

export default withTheme(DeleteWarningDialog);
