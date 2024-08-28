import React, { createContext, useEffect, useState } from "react";
import { APIURL } from "../lib/ApiKey";
import { defaultColor, tabAchat } from "../constant/page";
import { axiosInstance } from "../axiosInstance";
import Spinner from "react-spinner-material";
import loaderAnimation from "@/components/loader.json";
import Lottie from "lottie-react";
import SplashScreen from "../components/ui/splash-screen";

export const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [restos, setRestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [resInfo, setResInfo] = useState({});
  const [message, setMessage] = useState("");
  const [customization, setCustomization] = useState(defaultColor);
  const restoSlug = window.location.pathname.split("/")[2];
  const table_id = window.location.search.split("=")[1] || null;
  const [qrCode, setQrCode] = useState([]);
  const [tableName, setTableName] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const restoResponse = await fetch(
          `${APIURL}/api/getRestoBySlug/${restoSlug}`
        );
        const restoData = await restoResponse.json();
        if (restoData && restoData.length > 0) {
          const resto = restoData[0];
          setRestos(resto);

          const [
            categoryResponse,
            dishResponse,
            drinkResponse,
            infoResponse,
            customizationResponse,
          ] = await Promise.all([
            fetch(`${APIURL}/api/getCategorieByResto/${resto.id}`),
            fetch(
              `${APIURL}/api/getdishes/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""
              }`
            ),
            fetch(
              `${APIURL}/api/getdrinks/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""
              }`
            ),
            axiosInstance.get(`/api/infos/${resto.id}`),
            fetch(`${APIURL}/api/customizations/${resto.id}`),
          ]);

          const categoryData = await categoryResponse.json();
          const visibleCategories = categoryData.filter(
            (cat) => cat.visibility === 1
          );
          const visibleCategoryIds = visibleCategories.map((cat) => cat.id);
          setCategories(visibleCategories);

          const dishData = await dishResponse.json();
          const drinkData = await drinkResponse.json();
          let combinedData = [];
          const filteredDishes =
            dishData?.length > 0 &&
            dishData
              .filter((dish) => visibleCategoryIds.includes(dish.category_id))
              .map((item) => ({ ...item, type: "dish" }));
          const filteredDrinks =
            drinkData?.length > 0 &&
            drinkData
              .filter((drink) => visibleCategoryIds.includes(drink.category_id))
              .map((item) => ({ ...item, type: "drink" }));
          if (filteredDishes.length) {
            combinedData.push(...filteredDishes);
          }
          if (filteredDrinks.length) {
            combinedData.push(...filteredDrinks);
          }
          setDishes(combinedData);

          setResInfo(infoResponse.data[0]);
          const customizationData = await customizationResponse.json();
          setCustomization(customizationData[0] || defaultColor);
          const qrCodeRes = await axiosInstance.get(`/api/qrcodes/${resto.id}`);
          if (qrCodeRes) {
            setQrCode(qrCodeRes.data);
          }
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
    if (qrCode.length > 0 && table_id) {
      const getTableName = (tableId) => {
        const table = qrCode.find(qr => qr.table_id === parseInt(tableId));
        return table ? table.table.name : 'Default';
      };
      setTableName(getTableName(table_id));
    }
  }, [qrCode, table_id]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={loaderAnimation} loop={true} style={{ width: 500, height: 500 }} />
        {/* <SplashScreen />; */}
      </div>
    );
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
    setDishes,
    selectedTab,
    setSelectedTab,
    resInfo,
    setResInfo,
    message,
    setMessage,
    customization,
    setCustomization,
  };

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
