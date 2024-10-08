
import HomeTheme from './HomeTheme';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
// import Banner from "./Banner/Banner";
// import Tab from "./Tabs/Tab";
// import MenuItems from "./MenuItems/MenuItems";
import Info from "./Info/ThemeOneInfo";
// import Footer from "./Footer/Footerv2";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "i18next";
import global_en from "@/Theme01/translation/en/global.json"
import global_fr from "@/Theme01/translation/fr/global.json"
import global_it from "@/Theme01/translation/it/global.json"
import global_ar from "@/Theme01/translation/ar/global.json"
import global_es from "@/Theme01/translation/es/global.json"
// import global_en from "./translation/en/global.json"
// import global_fr from "./translation/fr/global.json"
// import global_es from "./translation/es/global.json"global_ar
// import global_it from "./translation/it/global.json"
// import global_ar from "./translation/ar/global.json"
import Achat from "./Achat/ThemeOneAchat";
import Claims from "./Claims/ThemeOneClaims";
import { APIURL, APIURLS3 } from "../lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"
import { Helmet } from "react-helmet";
import { useMenu } from '../hooks/useMenu';
import Footer from '../Theme01/Footer/Footerv2';
import Rate from '../Theme01/Rating/Rate';
import { axiosInstance } from '../../axiosInstance';
const Theme02 = () => {
  const incrementVisitorCount = async (id) => {
    console.log(`Requesting URL: ${axiosInstance.defaults.baseURL}/api/resto/incrementVisitorCount/${id}`);
    try {
      await axiosInstance.post(`/api/resto/incrementVisitorCount/${id}`);

    } catch (error) {
      console.error('Error incrementing visitor count:', error);
    }
  };
  useEffect(() => {
    incrementVisitorCount(restos.id);
  }, []);
  const {
    customization,
    restos,
    resInfo,
    dishes,
    categories,
    selectedTab,
    setSelectedTab,
    restoSlug,
  } = useMenu();

  const DEFAULT_THEME = {
    id: 4,
    selectedBgColor: "#fff",
    selectedHeader: "logo-header",
    selectedLayout: "theme-grid",
    selectedPrimaryColor: "#000",
    selectedSecondaryColor: "#6B7280",
    selectedTheme: 1,
    selectedTextColor: "#fff",
    selectedIconColor: "#fff",
    isDefault: true,
  };
  i18next.init({
    interpolation: { escapeValue: false },
    lng: resInfo.language,
    resources: {
      en: {
        global: global_en,
      },
      fr: {
        global: global_fr
      },
      es: {
        global: global_es,
      },
      it: {
        global: global_it
      },
      ar: {
        global: global_ar
      }
    }
  })
  return (

    <div className="h-screen " style={{ backgroundColor: customization?.selectedBgColor }}>
      <I18nextProvider i18n={i18next}>
        <Helmet>
          <title>{restos?.name}</title>
          <meta name="description" content={resInfo?.description} />
          <script>
            {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', ${resInfo.facebook_pixel});
                fbq('track', 'PageView');
                `}
          </script>
          <link rel="icon" type="image/svg+xml" href={`${APIURLS3}/${resInfo?.logo}`} />
        </Helmet>
        <Toaster />
        <Router>
          <div className="h-screen">

            <Routes>
              <Route
                path={`/menu/:restoSlug`}
                element={
                  <>
                    <HomeTheme />
                  </>
                }
              />
              <Route path="/menu/:restoSlug/Rating" element={
                <>
                  <Rate infoRes={resInfo} />
                  <Footer slug={restoSlug} customization={customization} DEFAULT_THEME={DEFAULT_THEME} />
                </>
              } />
              <Route path={`/menu/:restoSlug/info`} element={
                <>
                  <Info items={restos} customization={customization} infoRes={resInfo} />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              } />
              <Route path="/menu/:restoSlug/Achat" element={
                <>
                  <Achat infoRes={resInfo} resto_id={restos?.id} restoId={restos?.id} customization={customization} />
                  {/* <Footer slug={restoSlug} customization={customization} /> */}
                </>
              } />
              <Route path="/menu/:restoSlug/Claims" element={
                <>
                  <Claims items={restos} />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </I18nextProvider>
    </div>
  )
}

export default Theme02;