/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import i18n from '../utils/i18n';
import HomeScreen from './HomeScreen';

type State = {
  index: number,
  routes: Array<{
    key: string,
    title: string,
    icon: string,
  }>,
};

export default class HomeNavigator extends React.Component<{}, State> {
  state = {
    index: 0,
    routes: [
      { key: 'home', title: i18n.t('menu__home'), icon: 'home' },
      // { key: 'calendar', title: i18n.t('menu__calendar'), icon: 'date-range' },
      // { key: 'progress', title: i18n.t('menu__progress), icon: 'show-chart' },
      // { key: 'profile', title: i18n.t('menu__profile'), icon: 'person' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    // calendar: Calendar,
    // progress: Progress,
    // profile: Profile,
  });

  render() {
    return (
      /* $FlowFixMe theme overriding error */
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        shifting={false}
        barStyle={{ backgroundColor: '#212121' }}
        theme={{ colors: { primary: '#FFFFFF' } }}
      />
    );
  }
}
