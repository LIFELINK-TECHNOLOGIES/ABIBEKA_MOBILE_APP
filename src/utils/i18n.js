import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

import en from '../languages/en.json';
import fr from '../languages/fr.json';
import pcm from '../languages/pcm.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  pcm: { translation: pcm },
};

const LANGUAGE_KEY = 'appLanguage';

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
  react: {
    useSuspense: false,
  },
});

export const loadLanguage = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);
    if (savedLanguage && savedLanguage !== i18n.language) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.log('Error loading language:', error);
  }
};

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
  } catch (error) {
    console.log('Error changing language:', error);
  }
};

export default i18n;