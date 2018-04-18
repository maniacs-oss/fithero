/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Headline } from 'react-native-paper';

import Screen from '../components/Screen';

export default class Home extends Component<{}> {
  render() {
    return (
      <Screen style={styles.container}>
        <Headline>Home</Headline>
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
