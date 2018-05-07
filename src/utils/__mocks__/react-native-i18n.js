/* @flow */

import I18nJs from 'i18n-js'; // eslint-disable-line import/no-extraneous-dependencies

I18nJs.locale = 'en'; // a locale from your available translations
export const getLanguages = (): Promise<string[]> => Promise.resolve(['en']);
export default I18nJs;
