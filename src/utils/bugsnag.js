/* @flow */

/**
 * Create a singleton instance of the bugsnag client so we don't have to duplicate our configuration
 * anywhere.
 *
 * https://docs.bugsnag.com/platforms/react-native/#basic-configuration
 */
import { Client } from 'bugsnag-react-native';

const client = new Client('7cb80c4b3678382f5880b407003b05b1');

module.exports = client;
