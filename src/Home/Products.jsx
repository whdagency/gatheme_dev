import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCard from "../products/ProductCard";

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
              {selectedCat === "All" ? "Products" : selectedCat}
            </h2>
            <Link
              to={`/menu/${restoSlug}/products?table_id=${table_id}`}
              // onClick={() => setSeeAllProducts((prev) => !prev)}
              className="text-sm text-orange-500"
              style={{
                color: customization?.selectedPrimaryColor,
              }}
            >
              {seeAllProducts ? "See Less" : "See All"}
            </Link>
          </>
        ) : (
          <p>
            Your search term ({`"${searchProductTerm}"`}) yielded{" "}
            {products.length} result(s){" "}
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
          {`No products found for this search term`}
        </div>
      ) : message ? (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide flex flex-col items-center py-5 pb-32 mx-auto text-base text-center">
          {`No products found for the selected category`}
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
                time={product?.time || `${12} minutes`}
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
