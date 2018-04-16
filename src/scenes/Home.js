/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Headline } from 'react-native-paper';

import Screen from '../components/Screen';

type Props = {};
export default class Home extends Component<Props> {
  render() {
    return (
      <Screen style={styles.container}>
        <Headline>Dziku</Headline>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
