import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation from '../../translations/en/translation.json';
import translationZhCN from '../../translations/zh-CN/translation.json';

i18n.use(initReactI18next).init({
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',

  // have a common namespace used around the full app
  ns: ['translationsNS'],
  defaultNS: 'translationsNS',

  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: { translationsNS: translation },
    'zh-CN': { translationsNS: translationZhCN },
  },
});

export default i18n;
