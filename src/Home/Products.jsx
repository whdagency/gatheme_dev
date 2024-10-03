import { Star, X } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import ClipLoader from "react-spinners/ClipLoader";
import { Timer } from "../components/icons";

const Products = () => {
  const {
    products,
    resInfo,
    selectedCat,
    message,
    loading,
    searchProductTerm,
  } = useMenu();

  return (
    <div className="scrollbar-hide flex-1 px-4 mt-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        {searchProductTerm.length === 0 ? (
          <>
            <h2 className="text-lg font-bold capitalize">
              {selectedCat === "All" ? "Products" : selectedCat}
            </h2>
            <Link to="#" className="text-sm text-orange-500">
              See All
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
          <ClipLoader size={40} loading={loading} color={"#F86A2F"} />
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
          {products?.map((product) => (
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

const ProductCard = ({ image, title, rating, time, price, currency, id }) => {
  const navigate = useNavigate();
  const { restoSlug, table_id } = useMenu();

  const handleGotoProductDetails = () => {
    navigate(`/menu/${restoSlug}/products/${id}?table_id=${table_id}`);
  };

  return (
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={handleGotoProductDetails}
    >
      <img
        src={`${STORAGE_URL}/${image}`}
        alt={title}
        className="rounded-2xl object-cover w-20 h-20 shadow-sm"
        onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
      />

      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col items-start justify-between gap-5">
          <h3 className="font-semibold text-black">{title}</h3>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#F5A816] fill-current" />
              <span className="font-semibold text-black">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer />
              <span className="font-semibold text-black">{time}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end self-end justify-end gap-5">
          <X color={"#A6ADB4"} className="w-4 h-4 cursor-pointer" />

          <span className="text-base font-semibold text-black">
            {price.toFixed(2)}{" "}
            <span className="text-xs text-[#F86A2F] font-medium">
              {currency}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
