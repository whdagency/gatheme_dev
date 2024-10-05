import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  } = useMenu();
  const { t } = useTranslation("global");

  const [seeAllProducts, setSeeAllProducts] = useState(false);

  return (
    <div className="scrollbar-hide flex-1 px-4 mt-6 overflow-hidden">
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
            <Link
              to={`/menu/${restoSlug}/products?table_id=${table_id}`}
              // onClick={() => setSeeAllProducts((prev) => !prev)}
              className="text-sm text-orange-500"
              style={{
                color: customization?.selectedPrimaryColor,
              }}
            >
              {seeAllProducts
                ? t("common.actions.seeLess")
                : t("common.actions.seeAll")}
            </Link>
          </>
        ) : (
          <p className="flex items-center gap-1">
            {t("home.products.yourSearchTerm")} ({`"${searchProductTerm}"`})
            {t("home.products.yielded")} {products.length}{" "}
            {t("home.products.results")}{" "}
          </p>
        )}
      </div>

      {selectedCat !== "All" && loading ? (
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
      ) : message ? (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide flex flex-col items-center py-5 pb-32 mx-auto text-base text-center">
          {t("home.products.noProducts")}
        </div>
      ) : (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide pb-32">
          {products
            .slice(0, seeAllProducts ? products.length : 10)
            ?.map((product) => (
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
        </div>
      )}
    </div>
  );
};

export default Products;
