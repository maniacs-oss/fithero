/* @flow */

/**
 * Create a singleton instance of the bugsnag client so we don't have to duplicate our configuration
 * anywhere.
 *
 * https://docs.bugsnag.com/platforms/react-native/#basic-configuration
 */

import { Client } from 'bugsnag-react-native';

import { BUGSNAG_KEY } from '../../secrets';

const client = new Client(BUGSNAG_KEY);

module.exports = client;
