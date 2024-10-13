import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import ClipLoader from "react-spinners/ClipLoader";
import AnimatedLayout from "../shared/AnimateLayout";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

const Products = () => {
  const {
    products,
    resInfo,
    message,
    loading,
    searchProductTerm,
    setSearchProductTerm,
    customization,
  } = useMenu();
  const pathname = useLocation().pathname;
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [isFetching, setIsFetching] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  const { t } = useTranslation("global");

  const clearSearch = () => {
    setSearchProductTerm("");
    setSearchParams((prev) => {
      prev.delete("search");
      return prev;
    });
  };

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
      setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 10);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatedLayout>
      <div className="scrollbar-hide px-7 pb-28 relative flex-1 overflow-hidden">
        {/* Title and Back Button */}
        <button
          style={{
            boxShadow: "0px 1.633px 1.633px 0px rgba(0, 0, 0, 0.25)",
            borderRadius: "13.061px",
            background: "#FFF",
          }}
          onClick={() => window.history.back()}
          className="flex top-10 left-7 absolute z-50 w-fit items-center justify-center p-[8.163px] gap-[8.163px]"
        >
          <ArrowLeft size={25} color="black" />
        </button>
        {searchProductTerm.length !== 0 && (
          <button
            onClick={clearSearch}
            className="flex top-11 right-3 absolute z-50 w-fit items-center justify-center p-[8.163px] text-sm gap-[8.163px] hover:underline text-orange-500 font-medium"
            style={{
              color: customization?.selectedPrimaryColor,
            }}
          >
            {t("home.products.clearSearch")}
          </button>
        )}
        <h2
          className="top-12 left-1/2 absolute z-50 text-xl font-semibold text-center text-black capitalize -translate-x-1/2"
          style={{
            color: customization?.selectedTextColor,
          }}
        >
          {searchProductTerm.length === 0
            ? t("home.products.allProducts")
            : t("home.products.searchResults")}
        </h2>
        <div
          className="mt-28 flex items-center justify-between mb-3"
          style={{
            color: customization?.selectedTextColor,
          }}
        >
          {searchProductTerm.length !== 0 && (
            <p className="flex items-center gap-1">
              {t("home.products.yourSearchTerm")} ({`"${searchProductTerm}"`})
              {t("home.products.yielded")} {products.length}{" "}
              {t("home.products.results")}{" "}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <ClipLoader
              size={40}
              loading={loading}
              color={customization?.selectedPrimaryColor ?? "#F86A2F"}
            />
          </div>
        ) : products.length === 0 && searchProductTerm.length > 0 ? (
          <div
            className="flex items-center justify-center h-64"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {t("home.products.noResults")}
          </div>
        ) : message || products.length === 0 ? (
          <div
            className="flex items-center justify-center h-64"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {t("home.products.noProducts")}
          </div>
        ) : (
          <div className="space-y-5">
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
              <div className="flex items-center justify-center py-4 pb-10">
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
    </AnimatedLayout>
  );
};

export default Products;
