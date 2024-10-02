import React, { createContext, useEffect, useState } from "react";
import { APIURL } from "../lib/ApiKey";
import { defaultColor, tabAchat } from "../constant/page";
import { axiosInstance } from "../axiosInstance";
import Spinner from "react-spinner-material";
import loaderAnimation from "@/components/loader.json";
import Lottie from "lottie-react";
import SplashScreen from "../components/ui/splash-screen";
import { useSelector } from "react-redux";

export const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [restos, setRestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesTheme1, setCategoriesTheme1] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [resInfo, setResInfo] = useState({});
  const [message, setMessage] = useState("");
  const [customization, setCustomization] = useState(defaultColor);
  const restoSlug = window.location.pathname.split("/")[2];
  const table_id = window.location.search.split("=")[1] || null;
  const [qrCode, setQrCode] = useState([]);
  const [tableName, setTableName] = useState("")
  const [language, setLanguage] = useState('')
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [promo, setPromo] = useState([])
  const cartItems = useSelector(state => state.cart.items);
  const [openClaimsModal, setOpenClaimsModal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState({});

  const fetchSubscriptionPlan = async (resto_id) => {
    const defaultPlan = {
      hasPlanExpired: false,
      // user_id,
      resto_id,
      plan_id: 4,
      plan: {
        id: 4,
        name: "Basic",
        price: "Free",
        created_at: null,
        updated_at: null,
      },
      numberOfQrCodes: 1,
      numberOfThemes: 1,
      hasVipThemes: false,
      canOrderFeatures: false,
      canGetNotifications: false,
      hasPaymentIntegration: false,
      hasPosIntegration: false,
      hasFreeGaristaPos: false,
    };

    try {
      const { status, data } = await axiosInstance.get(
        `${APIURL}/api/getSubscriptionsByRestoId/${resto_id}`
      );

      console.log("the Data of Subscription => ",data);

      if (status !== 200 || !data?.length) {
        setSubscriptionPlan(defaultPlan);
        return;
      }

      const subData = data[0];

      const subscriptionData = {
        ...subData,
        hasPlanExpired:
          new Date(subData?.ends_at?.replace(" ", "T").concat(".000000Z")) <
          new Date().toISOString(),
      };

      if (subscriptionData?.hasPlanExpired) {
        setSubscriptionPlan(defaultPlan);
        return;
      }

      const planSettings = {
        Silver: {
          numberOfQrCodes: 20,
          numberOfThemes: 2,
          hasVipThemes: false,
          canOrderFeatures: true,
          canGetNotifications: true,
          hasPaymentIntegration: false,
          hasPosIntegration: false,
          hasFreeGaristaPos: false,
        },
        Gold: {
          numberOfQrCodes: 30,
          numberOfThemes: 4,
          hasVipThemes: false,
          canOrderFeatures: true,
          canGetNotifications: true,
          hasPaymentIntegration: true,
          hasPosIntegration: true,
          hasFreeGaristaPos: false,
        },
        Platinum: {
          numberOfQrCodes: 60,
          numberOfThemes: 4,
          hasVipThemes: true,
          canOrderFeatures: true,
          canGetNotifications: true,
          hasPaymentIntegration: true,
          hasPosIntegration: true,
          hasFreeGaristaPos: true,
        },
      };

      const planConfig = planSettings[subData?.plan?.name] || defaultPlan;

      setSubscriptionPlan({ ...subscriptionData, ...planConfig });
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      setSubscriptionPlan(defaultPlan);
    }
  };

  const incrementVisitorCount = async (id) => {
    try {
      await axiosInstance.post(`/api/resto/incrementVisitorCount/${id}`);
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const restoResponse = await fetch(`${APIURL}/api/getRestoBySlug/${restoSlug}`);
        const restoData = await restoResponse.json();
    
        if (restoData && restoData.length > 0) {
          const resto = restoData[0];
          setRestos(resto);
          await fetchSubscriptionPlan(resto.id);
          const [
            categoryResponse,
            dishResponse,
            promoResponse,
            drinkResponse,
            infoResponse,
            customizationResponse,
            suggestionsResponse
          ] = await Promise.all([
            fetch(`${APIURL}/api/getVisibleCategoriesTheme/${resto.id}`).catch(() => ({ json: () => [] })),
            fetch(`${APIURL}/api/getdishes/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`).catch(() => ({ json: () => [] })),
            fetch(`${APIURL}/api/banners/${resto.id}`).catch(() => ({ json: () => [] })),
            fetch(`${APIURL}/api/getdrinks/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`).catch(() => ({ json: () => [] })),
            axiosInstance.get(`/api/infos/${resto.id}`).catch(() => ({ data: [{}] })),
            fetch(`${APIURL}/api/customizations/${resto.id}`).catch(() => ({ json: () => [] })),
            axiosInstance.get(`/api/suggestions/${resto.id}`).catch(() => ({ data: [] })),
            incrementVisitorCount(resto.id)
          ]);
    
          const customizationData = await customizationResponse.json();
          setResInfo(infoResponse.data[0]);
          setLanguage(infoResponse.data[0].language);
          setCustomization(customizationData[0] || defaultColor);
    
          const qrCodeRes = await axiosInstance.get(`/api/qrcodes/${resto.id}`);
          console.log("The Qrcode => ", qrCodeRes.data);
          if (qrCodeRes.status == 200) {
            setQrCode(qrCodeRes.data);
          }
    
          // Convert categoryData to an array if it's an object
          let categoryData = await categoryResponse.json();
          if (typeof categoryData === 'object' && !Array.isArray(categoryData)) {
            console.log('Converting categoryData object to array');
            categoryData = Object.values(categoryData);
          }
    
          const visibleCategories = categoryData.filter(cat => cat.visibility === 1);
          const visibleCategoryIds = visibleCategories.map(cat => cat.id);
    
          setCategories(categoryData);
    
          const dishData = await dishResponse.json();
          const drinkData = await drinkResponse.json();
          let combinedData = [];
          const filteredDishes = dishData.length > 0 &&
            dishData.filter(dish => visibleCategoryIds.includes(dish.category_id)).map(item => ({ ...item, type: "dish" }));
          const filteredDrinks = drinkData.length > 0 &&
            drinkData.filter(drink => visibleCategoryIds.includes(drink.category_id)).map(item => ({ ...item, type: "drink" }));
          if (filteredDishes.length) {
            combinedData.push(...filteredDishes);
          }
          if (filteredDrinks.length) {
            combinedData.push(...filteredDrinks);
          }
    
          setDishes(combinedData);
    
          const suggestionsData = suggestionsResponse.data;
          const initialSelectedDishes = suggestionsData.filter(suggestion => suggestion.dishes).map(suggestion => suggestion.dishes);
          const initialSelectedDrinks = suggestionsData.filter(suggestion => suggestion.drinks).map(suggestion => suggestion.drinks);
    
          let combinedSelected = [];
          if (initialSelectedDishes.length) {
            combinedSelected.push(...initialSelectedDishes.map(item => ({ ...item, type: 'dish' })));
          }
          if (initialSelectedDrinks.length) {
            combinedSelected.push(...initialSelectedDrinks.map(item => ({ ...item, type: 'drink' })));
          }
          setSelectedDishes(combinedSelected);
    
          const promoData = await promoResponse.json();
          const visiblePromo = promoData.filter(cat => cat.visibility === 1);
          setPromo(visiblePromo);
    
        } else {
          setMessage("No restaurant found with the provided slug.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch restaurant data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [restoSlug, selectedTab]);
  useEffect(() => {
    if (table_id) {
      const getTableName = (tableId) => {
        const table = qrCode.find(qr => qr.table_id === parseInt(tableId));
        return table ? table.table.name : 'Main';
      };
      setTableName(getTableName(table_id));
    }
  }, [qrCode, table_id]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={loaderAnimation} loop={true} style={{ width: 400, height: 400 }} />
        {/* <SplashScreen />; */}
      </div>
    );
  }
  async function callWaiter() {
    try {
      const notification = {
        title: "New Call For Waiter",
        status: "Waiter",
        resto_id: resInfo.resto_id,
        table_id: table_id,
      };
      const responseNotification = await fetch(`${APIURL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });

      if (responseNotification) {
        console.log("Nice => ", responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }
  async function submitBille() {
    try {
      const notification = {
        title: "Asking For Bill",
        status: "Bill",
        resto_id: resInfo.resto_id,
        table_id: table_id,
      };
      const responseNotification = await fetch(`${APIURL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });

      if (responseNotification) {
        console.log("Nice => ", responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }
  const values = {
    table_id,
    restoSlug,
    tableName,
    cartCount,
    setCartCount,
    restos,
    setRestos,
    categories,
    setCategories,
    dishes,
    promo,
    setDishes,
    selectedTab,
    setSelectedTab,
    language,
    selectedDishes,
    resInfo,
    setResInfo,
    submitBille,
    callWaiter,
    message,
    setMessage,
    customization,
    categoriesTheme1,
    setCustomization,
    openClaimsModal, setOpenClaimsModal,
    subscriptionPlan,
  };

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
