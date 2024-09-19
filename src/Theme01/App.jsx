import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from './Rating/Rate';
import {  APIURLS3 } from "../lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"
import Home from "./Home/Home";
import { Helmet } from "react-helmet";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "i18next";
import global_en from "./translation/en/global.json"
import global_fr from "./translation/fr/global.json"
import global_es from "./translation/es/global.json"
import global_it from "./translation/it/global.json"
import global_ar from "./translation/ar/global.json"
import { PrimeReactProvider } from 'primereact/api';
import { useMenu } from "../hooks/useMenu";
function Theme01() {

  const {
    customization,
    restos,
    resInfo,
    dishes,
    categories,
    selectedTab,
    setSelectedTab,
    promo,
    language,
    selectedDishes,
    restoSlug,
  } = useMenu();


  i18next.init({
    interpolation: { escapeValue: false },
    lng: language == '' ? 'en' : language,
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
    <PrimeReactProvider>
      <I18nextProvider i18n={i18next}>
        <div className="h-screen" style={{ backgroundColor: customization?.selectedBgColor }}>
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
            {/* Google tag (gtag.js)  */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${resInfo.anylytics}`}></script>
            <script>
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${resInfo.anylytics}');`}
            </script>
            {/* <!-- TikTok Pixel Code Start --> */}
            <script>
              {`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js',o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement('script')
;n.type='text/javascript',n.async=!0,n.src=r+'?sdkid='+e+'&lib='+t;e=document.getElementsByTagName('script')[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${resInfo.tiktok_pixel}');
  ttq.page();
}(window, document, 'ttq');`}
            </script>
            <link rel="icon" type="image/svg+xml" href={`${APIURLS3}/${resInfo?.logo}`} />
          </Helmet>
          <Toaster />
          <Router>
            <div className="h-screen" style={{ backgroundColor: customization?.selectedBgColor }}>

              <Routes>
                <Route
                  path={`/menu/:restoSlug`}
                  element={
                    <>
                      <Home
                        categories={categories}
                        dishes={dishes}
                        resInfo={resInfo}
                        restoId={restos?.id}
                        filteredTheme={customization}
                        restoSlug={restoSlug}
                        restos={restos}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        promo={promo}
                        resto_id={restos?.id}
                      />
                    </>
                  }
                />
                <Route path="/menu/:restoSlug/Rating" element={
                  <>
                    <Rate infoRes={resInfo} />
                    <Footer slug={restoSlug} customization={customization} resto_id={restos?.id}/>
                  </>
                } />
                <Route path={`/menu/:restoSlug/info`} element={
                  <>
                    <Info items={restos} customization={customization} infoRes={resInfo} />
                    <Footer slug={restoSlug} customization={customization} resto_id={restos?.id}/>
                  </>
                } />
                <Route path="/menu/:restoSlug/Cart" element={
                  <>
                    <Achat slug={restoSlug} infoRes={resInfo} resto_id={restos?.id} restoId={restos?.id} customization={customization} selectedDishes={selectedDishes} />
                    <Footer slug={restoSlug} customization={customization} resto_id={restos?.id}/>
                  </>
                } />
                <Route path="/menu/:restoSlug/Claims" element={
                  <>
                    <Claims items={restos} />
                    <Footer slug={restoSlug} customization={customization} resto_id={restos?.id}/>
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </div>
      </I18nextProvider>
    </PrimeReactProvider>
  );
}


export default Theme01;
