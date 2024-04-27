import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enResources from "./locales/enResource"; // 영어 리소스 파일 임포트
import koResources from "./locales/koResource"; // 한글 리소스 파일 임포트

const resources = {
  en: enResources,
  ko: koResources,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;