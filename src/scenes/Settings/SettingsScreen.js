/* @flow */

import * as React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import PreferenceItem from './PreferenceItem';
import i18n from '../../utils/i18n';
import ListChoiceDialog from './ListChoiceDialog';
import {
  initSettings,
  setAppTheme,
  setDefaultUnitSystem,
  setFirstDayOfTheWeek,
} from '../../redux/modules/settings';
import type {
  AppThemeType,
  DefaultUnitSystemType,
  FirstDayOfTheWeekType,
  SettingsType,
} from '../../redux/modules/settings';
import { Divider } from 'react-native-paper';
import {
  backupDatabase,
  restoreDatabase,
} from '../../database/services/BackupService';
import Screen from '../../components/Screen';
import { getDefaultNavigationOptions } from '../../utils/navigation';

const DEFAULT_UNIT_SYSTEM = 'default_unit_system';
const FIRST_DAY_OF_THE_WEEK = 'first_day_of_the_week';
const APP_THEME = 'app_theme';

type NavigationOptions = {
  screenProps: {
    theme: AppThemeType,
  },
};

type Props = {
  appTheme: AppThemeType,
  setAppTheme: (theme: AppThemeType) => void,
  defaultUnitSystem: DefaultUnitSystemType,
  setDefaultUnitSystem: (unit: DefaultUnitSystemType) => void,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
  setFirstDayOfTheWeek: (day: FirstDayOfTheWeekType) => void,
  initSettings: (settings: SettingsType) => void,
};

type State = {
  showDialog: '' | typeof DEFAULT_UNIT_SYSTEM | typeof FIRST_DAY_OF_THE_WEEK,
};

class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ screenProps }: NavigationOptions) => {
    return {
      ...getDefaultNavigationOptions(screenProps.theme),
    };
  };

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

  _showAppThemeChange = () => {
    this.setState({ showDialog: APP_THEME });
  };

  _onDefaultUnitSystemChange = value => {
    this.props.setDefaultUnitSystem(value);
    this.setState({ showDialog: '' });
  };

  _onFirstDayOfTheWeekChange = value => {
    this.props.setFirstDayOfTheWeek(value);
    this.setState({ showDialog: '' });
  };

  _onAppThemeChange = theme => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme === 'default' ? '#233656' : '#000000');
    }
    this.props.setAppTheme(theme);
    this.setState({ showDialog: '' });
  };

  _restoreDatabase = () => {
    restoreDatabase(this.props.initSettings);
  };

  render() {
    const { appTheme, defaultUnitSystem, firstDayOfTheWeek } = this.props;
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
    const appThemeValues = ['default', 'dark'];
    const appThemeEntries = {
      default: i18n.t('default_theme'),
      dark: i18n.t('dark_theme'),
    };

    return (
      <Screen style={styles.screen}>
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
          values={firstDayOfTheWeekValues}
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
        <PreferenceItem
          title={i18n.t('app_theme')}
          selected={appTheme}
          values={appThemeValues}
          entries={appThemeEntries}
          onPress={this._showAppThemeChange}
        />
        <ListChoiceDialog
          title={i18n.t('app_theme')}
          onDismiss={this._onDialogDismiss}
          selected={appTheme}
          values={appThemeValues}
          entries={appThemeEntries}
          visible={showDialog === APP_THEME}
          onValueChange={this._onAppThemeChange}
        />
        <Divider style={styles.divider} />
        <PreferenceItem
          title={i18n.t('backup')}
          description={i18n.t('backup_description')}
          onPress={backupDatabase}
        />
        <PreferenceItem
          title={i18n.t('restore')}
          description={i18n.t('restore_description')}
          onPress={this._restoreDatabase}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
});

export default connect(
  state => ({
    appTheme: state.settings.appTheme,
    defaultUnitSystem: state.settings.defaultUnitSystem,
    firstDayOfTheWeek: state.settings.firstDayOfTheWeek,
  }),
  {
    initSettings,
    setDefaultUnitSystem,
    setFirstDayOfTheWeek,
    setAppTheme,
  }
)(SettingsScreen);
