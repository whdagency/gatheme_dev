import i18next from "i18next";
import React, { createContext } from "react";
import { I18nextProvider } from "react-i18next";
import global_en from "../translation/en/global.json";
import global_fr from "../translation/fr/global.json";
import global_it from "../translation/it/global.json";
import global_ar from "../translation/ar/global.json";
import global_es from "../translation/es/global.json";
import { useMenu } from "../hooks/useMenu";

const I18NextProviderContext = createContext();

const I18NextProvider = ({ children }) => {
  const { selectedLanguage: language } = useMenu();
  const resources = {
    en: {
      global: global_en,
    },
    fr: {
      global: global_fr,
    },
    es: {
      global: global_es,
    },
    it: {
      global: global_it,
    },
    ar: {
      global: global_ar,
    },
  };

  i18next.init({
    interpolation: { escapeValue: false },
    lng: language == "" ? "en" : language,
    resources,
  });

  return (
    <I18NextProviderContext.Provider value={{}}>
      <I18nextProvider i18n={i18next} defaultNS={"global"}>
        {children}
      </I18nextProvider>
    </I18NextProviderContext.Provider>
  );
};

export default I18NextProvider;
