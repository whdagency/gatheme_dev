import { createContext, useEffect, useState, useMemo } from "react";
import { defaultCustomization } from "../constant";
import Lottie from "lottie-react";
import loaderAnimation from "@/components/loader.json";
import fetchApiData from "../lib/fetch-data";
import { Helmet } from "react-helmet-async";
import { STORAGE_URL } from "../lib/api";

export const AppContext = createContext();

const useFetchRestoData = (restoSlug, selectedCat, searchTerm) => {
  const [data, setData] = useState({
    restos: {},
    categories: [],
    products: [],
    resInfo: {},
    customization: defaultCustomization,
    message: "",
    loading: false,
    qrCode: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setData((prev) => ({ ...prev, loading: true, message: "" }));

      try {
        const restoData = await fetchApiData(
          `/getRestoBySlug/${restoSlug}`,
          []
        );

        if (!restoData || restoData.length === 0) {
          setData((prev) => ({
            ...prev,
            message: "No restaurant found with the provided slug.",
            loading: false,
          }));
          return;
        }

        const resto = restoData[0];
        const searchQuery =
          selectedCat === "All" ? "" : `?category=${selectedCat}`;

        const [
          categoryData,
          dishData,
          drinkData,
          infoData,
          customizationData,
          qrCodeData,
        ] = await Promise.all([
          fetchApiData(`/getCategorieByResto/${resto.id}`, []),
          fetchApiData(`/getdishes/${resto.id}${searchQuery}`, []),
          fetchApiData(`/getdrinks/${resto.id}${searchQuery}`, []),
          fetchApiData(`/infos/${resto.id}`, {}),
          fetchApiData(`/customizations/${resto.id}`, defaultCustomization),
          fetchApiData(`/qrcodes/${resto.id}`, []),
        ]);

        setData((prev) => ({
          ...prev,
          loading: false,
        }));

        const visibleCategories = categoryData?.filter(
          (cat) => cat.visibility === 1
        );

        const visibleCategoryIds = visibleCategories.map((cat) => cat.id);

        const filteredDishes = dishData
          ?.filter((dish) => visibleCategoryIds.includes(dish.category_id))
          .map((item) => ({ ...item, type: "dish" }));

        const filteredDrinks = drinkData
          ?.filter((drink) => visibleCategoryIds.includes(drink.category_id))
          .map((item) => ({ ...item, type: "drink" }));

        const combinedData = [...filteredDishes, ...filteredDrinks];

        setData((prev) => ({
          ...prev,
          restos: resto,
          categories: [{ name: "All", id: 0 }, ...visibleCategories],
          products: searchTerm
            ? combinedData?.filter((data) =>
                data?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
              )
            : combinedData,
          resInfo: infoData[0] || {},
          customization: customizationData[0] || defaultCustomization,
          qrCode: qrCodeData || [],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setData((prev) => ({
          ...prev,
          message: "Failed to fetch restaurant data. Please try again.",
          loading: false,
        }));
      }
    };

    fetchData();
  }, [restoSlug, selectedCat, searchTerm]);

  return data;
};

const AppProvider = ({ children }) => {
  const restoSlug = useMemo(() => window.location.pathname.split("/")[2], []);
  const queryParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const table_id = queryParams.get("table_id") || null;
  const searchTerm = queryParams.get("search") || "";
  const cat = queryParams.get("cat") || "All";
  const [selectedCat, setSelectedCat] = useState(cat);
  const [searchProductTerm, setSearchProductTerm] = useState(searchTerm);
  const [tableName, setTableName] = useState("");
  const [showSplashScreenLoader, setShowSplashScreenLoader] = useState(true);

  const {
    restos,
    categories,
    products,
    resInfo,
    customization,
    message,
    loading,
    qrCode,
  } = useFetchRestoData(restoSlug, selectedCat, searchProductTerm);

  useEffect(() => {
    setSelectedCat(cat);
  }, [cat]);

  useEffect(() => {
    setSearchProductTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (qrCode.length > 0 && table_id) {
      const getTableName = (tableId) => {
        const table = qrCode.find((qr) => qr.table_id === parseInt(tableId));
        return table ? table.table.name : "Main";
      };
      setTableName(getTableName(table_id));
    }
  }, [qrCode, table_id]);

  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreenLoader(false);
    }, 3000);
  }, []);

  const values = useMemo(
    () => ({
      table_id,
      restoSlug,
      restos,
      categories,
      products,
      selectedCat,
      setSelectedCat,
      resInfo,
      tableName,
      message,
      customization,
      loading,
      setSearchProductTerm,
      searchProductTerm,
    }),
    [
      table_id,
      restoSlug,
      restos,
      categories,
      products,
      selectedCat,
      tableName,
      resInfo,
      message,
      customization,
      loading,
      setSearchProductTerm,
      searchProductTerm,
    ]
  );

  if (showSplashScreenLoader) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie
          animationData={loaderAnimation}
          loop={false}
          style={{ width: 600, height: 600 }}
          onAnimationEnd={() => setShowSplashScreenLoader(false)}
        />
      </div>
    );
  }

  return (
    <AppContext.Provider value={values}>
      <Helmet>
        <title>{`${restos?.name || "Welcome to Garista"}`}</title>
        <meta name="description" content={restos?.description} />
        <link
          rel="icon"
          href={`${STORAGE_URL}/${resInfo?.logo}`}
          type="image/png"
        />
      </Helmet>
      <section className="w-full mx-auto">{children}</section>
    </AppContext.Provider>
  );
};

export default AppProvider;