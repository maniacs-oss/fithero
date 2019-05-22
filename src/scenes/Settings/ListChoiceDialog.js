/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

import i18n from '../../utils/i18n';
import withTheme from '../../utils/theme/withTheme';
import RadioButtonItem from './RadioButtonItem';
import type { ThemeType } from '../../utils/theme/withTheme';

type Props = {
  title: string,
  description?: string,
  onDismiss: () => void,
  onValueChange: (value: string) => void,
  selected: string,
  values: Array<string>,
  visible: boolean,
  scrollable?: boolean,
  entries: { [key: string]: string },
  theme: ThemeType,
};

class ListChoiceDialog extends React.Component<Props> {
  _renderDialogContent = () => {
    const {
      description,
      entries,
      onValueChange,
      scrollable,
      selected,
      values,
    } = this.props;
    const options = values.map(v => (
      <RadioButtonItem
        key={v}
        checked={v === selected}
        value={v}
        title={entries[v]}
        onValueChange={onValueChange}
      />
    ));

    if (scrollable) {
      return (
        <Dialog.ScrollArea style={styles.dialogContent}>
          {description && (
            <Paragraph stsyle={styles.description}>{description}</Paragraph>
          )}
          <ScrollView>{options}</ScrollView>
        </Dialog.ScrollArea>
      );
    }

    return (
      <Dialog.Content style={styles.dialogContent}>
        {description && (
          <Paragraph style={styles.description}>{description}</Paragraph>
        )}
        {options}
      </Dialog.Content>
    );
  };

  render() {
    const { title, onDismiss, visible } = this.props;
    const { colors } = this.props.theme;

    return (
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={onDismiss}
          theme={{
            colors: {
              primary: colors.accent,
              surface: colors.dialogBackground,
            },
          }}
        >
          <Dialog.Title>{title}</Dialog.Title>
          {this._renderDialogContent()}
          <Dialog.Actions>
            <Button onPress={onDismiss}>{i18n.t('cancel')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
  },
  description: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

export default withTheme(ListChoiceDialog);
