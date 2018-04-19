/* @flow */

import I18n from 'react-native-i18n';
import { en, es } from './locales';

I18n.fallbacks = true;
I18n.translations = {
  en,
  es,
};

export default I18n;
