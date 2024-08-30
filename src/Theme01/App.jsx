import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { tabAchat } from './constant/page'
// import Banner from "./Banner/Banner";
// import Tab from "./Tabs/Tab";
// import MenuItems from "./MenuItems/MenuItems";
import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from './Rating/Rate';
import Spinner from "react-spinner-material";
import loaderAnimation from "@/components/loader.json";
import Lottie from "lottie-react";
import { axiosInstance } from "../axiosInstance";
import { APIURL } from "../lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"
// import { usePublishedTheme } from "@/hooks/usePublishedTheme";
import Home from "./Home/Home";
import { Helmet } from "react-helmet";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "i18next";
import global_en from "./translation/en/global.json"
import global_fr from "./translation/fr/global.json"
import global_es from "./translation/es/global.json"
import global_it from "./translation/it/global.json"
import global_ar from "./translation/ar/global.json"
// import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import { database, onValue, ref } from "../firebaseConfig";
import { useSelector } from "react-redux";
// import 'primeflex/primeflex.css';  
// import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
function Theme01() {
  const defaultColor = {
    selectedTheme: 1,
    selectedBgColor: "#fff",
    selectedHeader: "logo-header",
    selectedLayout: "theme-grid",
    selectedPrimaryColor: "#28509E",
    selectedSecondaryColor: "#6B7280",
    selectedTextColor: "#000",
    selectedIconColor: "#FFFFFF",
  };
  const cartItems = useSelector(state => state.cart.items);

  const [t, i18n] = useTranslation('global')
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [restos, setRestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('')
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [promo, setPromo] = useState([])
  const [selectedTab, setSelectedTab] = useState('All');
  const [resInfo, setResInfo] = useState({});
  const [message, setMessage] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [customization, setCustomization] = useState(defaultColor);
  const restoSlug = window.location.pathname.split("/")[2];
  const incrementVisitorCount = async (id) => {
    try {
      await axiosInstance.post(`/api/resto/incrementVisitorCount/${id}`);
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const restoResponse = await fetch(`${APIURL}/api/getRestoBySlug/${restoSlug}`);
        const restoData = await restoResponse.json();
        if (restoData && restoData.length > 0) {
          const resto = restoData[0];
          setRestos(resto);

          const [
            categoryResponse,
            suggestionsResponse,
            promoResponse,
            dishResponse,
            drinkResponse,
            infoResponse,
            customizationResponse
          ] = await Promise.all([
            fetch(`${APIURL}/api/getCategorieByResto/${resto.id}`),
            axiosInstance.get(`/api/suggestions/${resto.id}`),
            fetch(`${APIURL}/api/banners/${resto.id}`),
            fetch(`${APIURL}/api/getdishes/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`),
            fetch(`${APIURL}/api/getdrinks/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`),
            axiosInstance.get(`/api/infos/${resto.id}`),
            fetch(`${APIURL}/api/customizations/${resto.id}`)
          ]);

          const categoryData = await categoryResponse.json();
          const promoData = await promoResponse.json();
          const suggestionsData = suggestionsResponse.data;

          const initialSelectedDishes = suggestionsData
            .filter(suggestion => suggestion.dishes)
            .map(suggestion => suggestion.dishes);

          const initialSelectedDrinks = suggestionsData
            .filter(suggestion => suggestion.drinks)
            .map(suggestion => suggestion.drinks);

          let combinedSelected = [];
          if (initialSelectedDishes.length) {
            combinedSelected.push(...initialSelectedDishes.map(item => ({ ...item, type: 'dish' })));
          }
          if (initialSelectedDrinks.length) {
            combinedSelected.push(...initialSelectedDrinks.map(item => ({ ...item, type: 'drink' })));
          }

          const filteredSuggestions = combinedSelected.filter(suggestion => {
            return !cartItems.some(cartItem => cartItem.id === suggestion.id && cartItem.type === suggestion.type);
          });

          setSelectedDishes(filteredSuggestions);

          const visibleCategories = categoryData.filter(cat => cat.visibility === 1);
          const visiblePromo = promoData.filter(cat => cat.visibility === 1);
          const visibleCategoryIds = visibleCategories.map(cat => cat.id);

          setCategories(visibleCategories);
          setPromo(visiblePromo);

          const dishData = await dishResponse.json();
          const drinkData = await drinkResponse.json();

          let combinedData = [];
          let filteredDishes = [];
          let filteredDrinks = []
          if (dishData.length > 0) {

            filteredDishes = dishData?.filter(dish => visibleCategoryIds.includes(dish.category_id)).map(item => ({ ...item, type: 'dish' }));
          }
          if (drinkData.length > 0) {
            filteredDrinks = drinkData?.filter(drink => visibleCategoryIds.includes(drink.category_id)).map(item => ({ ...item, type: 'drink' }));
          }

          if (filteredDishes.length) {
            combinedData.push(...filteredDishes);
          }
          if (filteredDrinks.length) {
            combinedData.push(...filteredDrinks);
          }

          setDishes(combinedData);
          setResInfo(infoResponse.data[0]);
          setLanguage(infoResponse.data[0].language)
          const customizationData = await customizationResponse.json();
          setCustomization(customizationData[0] || defaultColor);
        } else {
          setMessage('No restaurant found with the provided slug.');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage('Failed to fetch restaurant data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restoSlug]);

  if (loading) {
    return (
      <div className='justify-center items-center flex h-screen'>
        <Lottie animationData={loaderAnimation} loop={true} style={{ width: 400, height: 400 }} />
      </div>
    );
  }

  // if(!isValidSlug)
  // {
  //   return <Navigate to="/not-found" replace />; 
  // }
  // useEffect(() => {
  //   i18next.changeLanguage(language);
  // }, [language]);

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
        <div className="h-screen " style={{ backgroundColor: customization?.selectedBgColor }}>
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
            <div className="h-screen">

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
                      />
                    </>
                  }
                />
                <Route path="/menu/:restoSlug/Rating" element={
                  <>
                    <Rate infoRes={resInfo} />
                    <Footer slug={restoSlug} customization={customization} />
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
                    <Achat slug={restoSlug} infoRes={resInfo} resto_id={restos?.id} restoId={restos?.id} customization={customization} selectedDishes={selectedDishes} />
                    <Footer slug={restoSlug} customization={customization} />
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
        </div>
      </I18nextProvider>
    </PrimeReactProvider>
  );
}

function useValidateSlug(slug, validSlugs) {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!validSlugs.includes(slug)) {
      setIsValid(false);
      navigate("/not-found", { replace: true }); // Redirects to a "Not Found" page
    }
  }, [slug, validSlugs, navigate]);

  return isValid;
}


export default Theme01;
