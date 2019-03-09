/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import PreferenceItem from './PreferenceItem';
import i18n from '../../utils/i18n';
import ListChoiceDialog from './ListChoiceDialog';
import { setDefaultUnitSystem } from '../../redux/modules/settings';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  setDefaultUnitSystem: (unit: DefaultUnitSystemType) => void,
};

type State = {
  showDialog: '' | 'default_unit_system',
};

class SettingsScreen extends React.Component<Props, State> {
  state = {
    showDialog: '',
  };

  _onDialogDismiss = () => {
    this.setState({ showDialog: '' });
  };

  _showDefaultUnitSystemDialog = () => {
    this.setState({ showDialog: 'default_unit_system' });
  };

  _onDefaultUnitSystemChange = value => {
    this.props.setDefaultUnitSystem(value);
    this.setState({ showDialog: '' });
  };

  render() {
    const { defaultUnitSystem } = this.props;
    const { showDialog } = this.state;

    return (
      <View style={styles.screen}>
        <PreferenceItem
          title={i18n.t('default_unit_system')}
          selected={defaultUnitSystem}
          values={['metric', 'imperial']}
          onPress={this._showDefaultUnitSystemDialog}
        />
        <ListChoiceDialog
          title={i18n.t('default_unit_system')}
          description={i18n.t('default_unit_system_desc')}
          onDismiss={this._onDialogDismiss}
          selected={defaultUnitSystem}
          values={['metric', 'imperial']}
          visible={showDialog === 'default_unit_system'}
          onValueChange={this._onDefaultUnitSystemChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 8,
  },
});

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
  }),
  {
    setDefaultUnitSystem,
  }
)(SettingsScreen);
