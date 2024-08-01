
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
import global_en from "./translation/en/global.json"
import global_fr from "./translation/fr/global.json"
import global_es from "./translation/es/global.json"
import global_it from "./translation/it/global.json"
import global_ar from "./translation/ar/global.json"
import Achat from "./Achat/ThemeOneAchat";
import Claims from "./Claims/ThemeOneClaims";
import { APIURL } from "../lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"
import { Helmet } from "react-helmet";
import { useMenu } from '../hooks/useMenu';
import Footer from '../Theme01/Footer/Footerv2';
import Rate from '../Theme01/Rating/Rate';

const Theme02 = () => {
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
      i18next.init({
        interpolation: {escapeValue: false},
        lng:resInfo.language,
        resources: {
          en:{
            global: global_en,
          },
          fr:{  
            global: global_fr
          },
          es:{
            global: global_es,
          },
          it:{
            global: global_it
          },
          ar:{
            global: global_ar
          }
        }
      })
      console.log("The Resto Infos02 => ",resInfo);
  return (

        <div className="h-screen " style={{backgroundColor: customization?.selectedBgColor}}>
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
            {/* <noscript>
                <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${resInfo.facebook_pixel}&ev=PageView&noscript=1`}
                alt="Facebook Pixel"
                />
            </noscript> */}
                {/* {console.log(resInfo.facebook_pixel)}
                {console.log(resInfo.tiktok_pixel)}
                {console.log(resInfo.ads_pixel)}
                {console.log(resInfo.anylytics)} */}
                <link rel="icon" type="image/svg+xml" href={`${APIURL}/storage/${resInfo?.logo}`} />
            </Helmet>
              <Toaster />
        <Router>
        <div className="h-screen  ">

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
                <Rate infoRes={resInfo}/>
                  <Footer slug={restoSlug} customization={customization} />
                </>
              } />
              <Route path={`/menu/:restoSlug/info`} element={
                <>
                <Info items={restos} customization={customization} infoRes={resInfo}/>
                  <Footer slug={restoSlug} customization={customization} />
                </>
              } />
              <Route path="/menu/:restoSlug/Achat" element={
                <>
                <Achat infoRes={resInfo} resto_id={restos?.id}  restoId={restos?.id} customization={customization}/>
                  {/* <Footer slug={restoSlug} customization={customization} /> */}
                </>
              } />
              <Route path="/menu/:restoSlug/Claims" element={
                <>
                  <Claims items={restos}/>
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
    // <div
    //   style={{ backgroundColor: customization.selectedBgColor }}
    //   className="max-w-2xl md:shadow md:h-[95vh] w-full md:overflow-y-scroll oveflow-x-hidden scrollbar-hide pb-20 relative"
    // >
    //   <ThemeOneHeader />

    //   <ThemeOneBanner />

    //   {/* Dishes Sorted By Category */}
    //   <div className="flex flex-col gap-3 px-5">
    //     {categories.map((category) => {
    //       const filteredDishes = dishesByCategory(category.id);

    //       if (filteredDishes.length === 0) {
    //         return null;
    //       }

    //       return (
    //         <div
    //           key={category.id}
    //           className="flex flex-col justify-center gap-4 pt-5"
    //         >
    //           <Accordion
    //             type="multiple"
    //             defaultValue={[...categories.map((cat) => cat.id)]}
    //             collapsible
    //             className="flex flex-col gap-3"
    //           >
    //             <ThemeDishes category={category} dishes={filteredDishes} />
    //           </Accordion>
    //         </div>
    //       );
    //     })}
    //   </div>

    //   <div className="flex flex-col items-center w-full">
    //     <ThemeOneFooter />
    //   </div>
    // </div>

export default Theme02;