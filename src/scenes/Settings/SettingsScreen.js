/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import PreferenceItem from './PreferenceItem';
import i18n from '../../utils/i18n';
import ListChoiceDialog from './ListChoiceDialog';
import {
  setDefaultUnitSystem,
  setFirstDayOfTheWeek,
} from '../../redux/modules/settings';
import type {
  DefaultUnitSystemType,
  FirstDayOfTheWeekType,
} from '../../redux/modules/settings';

const DEFAULT_UNIT_SYSTEM = 'default_unit_system';
const FIRST_DAY_OF_THE_WEEK = 'first_day_of_the_week';

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  setDefaultUnitSystem: (unit: DefaultUnitSystemType) => void,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
  setFirstDayOfTheWeek: (day: FirstDayOfTheWeekType) => void,
};

type State = {
  showDialog: '' | typeof DEFAULT_UNIT_SYSTEM | typeof FIRST_DAY_OF_THE_WEEK,
};

class SettingsScreen extends React.Component<Props, State> {
  state = {
    showDialog: '',
  };

  _onDialogDismiss = () => {
    this.setState({ showDialog: '' });
  };

  _showDefaultUnitSystemDialog = () => {
    this.setState({ showDialog: DEFAULT_UNIT_SYSTEM });
  };

  _showFirstDayOfTheWeekChange = () => {
    this.setState({ showDialog: FIRST_DAY_OF_THE_WEEK });
  };

  _onDefaultUnitSystemChange = value => {
    this.props.setDefaultUnitSystem(value);
    this.setState({ showDialog: '' });
  };

  _onFirstDayOfTheWeekChange = value => {
    this.props.setFirstDayOfTheWeek(value);
    this.setState({ showDialog: '' });
  };

  render() {
    const { defaultUnitSystem, firstDayOfTheWeek } = this.props;
    const { showDialog } = this.state;

    const defaultUnitSystemValues = ['metric', 'imperial'];
    const defaultUnitSystemEntries = {
      metric: i18n.t('metric'),
      imperial: i18n.t('imperial'),
    };
    const firstDayOfTheWeekValues = ['monday', 'sunday', 'saturday'];
    const firstDayOfTheWeekEntries = {
      monday: i18n.t('day__monday'),
      sunday: i18n.t('day__sunday'),
      saturday: i18n.t('day__saturday'),
    };

    return (
      <View style={styles.screen}>
        <PreferenceItem
          title={i18n.t('default_unit_system')}
          selected={defaultUnitSystem}
          values={defaultUnitSystemValues}
          entries={defaultUnitSystemEntries}
          onPress={this._showDefaultUnitSystemDialog}
        />
        <ListChoiceDialog
          title={i18n.t('default_unit_system')}
          description={i18n.t('default_unit_system_desc')}
          onDismiss={this._onDialogDismiss}
          selected={defaultUnitSystem}
          values={defaultUnitSystemValues}
          entries={defaultUnitSystemEntries}
          visible={showDialog === DEFAULT_UNIT_SYSTEM}
          onValueChange={this._onDefaultUnitSystemChange}
        />
        <PreferenceItem
          title={i18n.t('first_day_of_the_week')}
          selected={firstDayOfTheWeek}
          values={['monday', 'sunday', 'saturday']}
          entries={firstDayOfTheWeekEntries}
          onPress={this._showFirstDayOfTheWeekChange}
        />
        <ListChoiceDialog
          title={i18n.t('first_day_of_the_week')}
          onDismiss={this._onDialogDismiss}
          selected={firstDayOfTheWeek}
          values={firstDayOfTheWeekValues}
          entries={firstDayOfTheWeekEntries}
          visible={showDialog === FIRST_DAY_OF_THE_WEEK}
          onValueChange={this._onFirstDayOfTheWeekChange}
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
    firstDayOfTheWeek: state.settings.firstDayOfTheWeek,
  }),
  {
    setDefaultUnitSystem,
    setFirstDayOfTheWeek,
  }
)(SettingsScreen);
