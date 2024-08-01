import i18next from "i18next";
import global_en from "./en/global.json"
import global_fr from "./fr/global.json"
export const i18nextMenu = i18next.init({
    interpolation: {escapeValue: false},
    lng:"en",
    resources: {
      en:{
        global: global_en,
      },
      fr:{
        global: global_fr
      },
      // es:{
      //   global: global_es,
      // },
      // ar:{
      //   global: global_ar
      // }
    }
  })

  // export default i18nextMenu;