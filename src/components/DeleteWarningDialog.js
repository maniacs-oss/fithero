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

type Props = {
  description: string,
  title?: string,
  onConfirm: () => void,
  onDismiss: () => void,
};

class DeleteWarningDialog extends React.Component<Props> {
  render() {
    const { description, title, onConfirm, onDismiss } = this.props;
    return (
      <Portal>
        <Dialog visible theme={DefaultTheme} onDismiss={onDismiss}>
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

export default DeleteWarningDialog;
