import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCard from "../products/ProductCard";
import { useTranslation } from "react-i18next";

const Products = () => {
  const {
    products,
    resInfo,
    selectedCat,
    message,
    loading,
    searchProductTerm,
    restoSlug,
    table_id,
    customization,
    setSelectedCat,
  } = useMenu();
  const { t } = useTranslation("global");

  const [visibleProducts, setVisibleProducts] = useState(7); // Start by showing 7 products
  const [isFetching, setIsFetching] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Infinite scrolling logic
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isFetching &&
      visibleProducts < products.length // Check if there are more products to fetch
    ) {
      setIsFetching(true);
    }
  }, [isFetching, visibleProducts, products.length]);

  const fetchMoreProducts = () => {
    setTimeout(() => {
      setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 7);
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    if (isFetching && visibleProducts < products.length) {
      fetchMoreProducts();
    }
  }, [isFetching, visibleProducts, products.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSeeAllProducts = () => {
    navigate(
      `/menu/${restoSlug}/products?table_id=${table_id}&cat=${selectedCat}`
    );
  };

  return (
    <div className="scrollbar-hide flex-1 px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        {searchProductTerm.length === 0 ? (
          <>
            <h2
              className="text-lg font-bold capitalize"
              style={{
                color: customization?.selectedTextColor,
              }}
            >
              {selectedCat === "All" ? t("home.products.title") : selectedCat}
            </h2>
            <button
              onClick={handleSeeAllProducts}
              className="text-sm text-orange-500"
              style={{
                color: customization?.selectedPrimaryColor,
              }}
            >
              {t("common.actions.seeAll")}
            </button>
          </>
        ) : (
          <p className="flex items-center gap-1">
            {t("home.products.yourSearchTerm")} ({`"${searchProductTerm}"`})
            {t("home.products.yielded")} {products.length}{" "}
            {t("home.products.results")}{" "}
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide flex flex-col items-center py-5 pb-32 mx-auto text-base text-center">
          <ClipLoader
            size={40}
            loading={loading}
            color={customization?.selectedPrimaryColor ?? "#F86A2F"}
          />
        </div>
      ) : products.length === 0 && searchProductTerm.length > 0 ? (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide flex flex-col items-center py-5 pb-32 mx-auto text-base text-center">
          {t("home.products.noResults")}
        </div>
      ) : message || products.length === 0 ? (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide flex flex-col items-center py-5 pb-32 mx-auto text-base text-center">
          {t("home.products.noProducts")}
        </div>
      ) : (
        <div className="scrollbar-hide pb-32 pr-2 space-y-4 overflow-y-auto">
          {products.slice(0, visibleProducts).map((product) => (
            <ProductCard
              key={product?.name}
              image={
                product?.image1?.startsWith("default_images")
                  ? ""
                  : product?.image1
              }
              title={product.name}
              rating={product?.rating || 4.5}
              time={product?.time || `${12} ${t("home.products.minutes")}`}
              price={parseFloat(product?.price)}
              currency={resInfo?.currency || "MAD"}
              id={product?.id}
            />
          ))}

          {isFetching && visibleProducts < products.length && (
            <div className="flex justify-center mt-4">
              <ClipLoader
                size={30}
                loading={isFetching}
                color={customization?.selectedPrimaryColor ?? "#F86A2F"}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
