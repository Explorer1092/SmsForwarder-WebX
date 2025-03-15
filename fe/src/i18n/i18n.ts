import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

// 初始化i18next
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    // 默认语言
    fallbackLng: 'en',
    // 是否启用调试
    debug: false,
    // 检测语言选项
    detection: {
      order: ['navigator', 'htmlTag', 'cookie', 'localStorage', 'path', 'subdomain'],
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
    // 插值选项
    interpolation: {
      escapeValue: false // 不转义HTML
    }
  });

export default i18n;
