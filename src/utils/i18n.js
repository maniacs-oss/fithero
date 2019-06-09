/* @flow */

import * as RNLocalize from 'react-native-localize';
import i18nJS from 'i18n-js';
import memoize from 'lodash/memoize';
import { en, es } from './locales';

const translate = memoize(
  (key, config) => i18nJS.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

// fallback if no available language fits
const fallback = { languageTag: 'en', isRTL: false };

const { languageTag } =
  RNLocalize.findBestAvailableLanguage(['en', 'es']) || fallback;

// clear translation cache
translate.cache.clear();

// set i18n-js config
i18nJS.fallbacks = true;
i18nJS.translations = {
  en,
  es,
};
i18nJS.locale = languageTag;

export const clearTranslateCache = () => translate.cache.clear();

export const changeLanguage = () => {
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(['en', 'es']) || fallback;
  if (i18nJS.locale !== languageTag) {
    clearTranslateCache();
    i18nJS.locale = languageTag;
    return true;
  }
  return false;
};

const i18n = {
  t: translate,
};

export default i18n;
