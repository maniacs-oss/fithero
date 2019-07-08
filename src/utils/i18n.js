/* @flow */

import * as RNLocalize from 'react-native-localize';
import i18nJS from 'i18n-js';
import memoize from 'lodash/memoize';
// Supported languages for moment
import 'moment/locale/es';

import { en, es } from './locales';

const translate = memoize(
  (key, config) => i18nJS.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

// fallback if no available language fits
const fallback = { languageTag: 'en', isRTL: false };

const { languageTag } =
  RNLocalize.findBestAvailableLanguage(['ca', 'en', 'es']) || fallback;

// clear translation cache
translate.cache.clear();

// set i18n-js config
i18nJS.fallbacks = true;
i18nJS.translations = {
  ca: es,
  en,
  es,
};
i18nJS.locale = languageTag;

export const clearTranslateCache = () => translate.cache.clear();

const i18n = {
  t: translate,
};

export default i18n;
