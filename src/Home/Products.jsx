import { Star, X } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import ClipLoader from "react-spinners/ClipLoader";

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

const Timer = ({ color = "#F86A2F" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8.00033 0.667969C6.54993 0.667969 5.13211 1.09806 3.92615 1.90386C2.72019 2.70966 1.78025 3.85497 1.22521 5.19496C0.67017 6.53495 0.524945 8.00944 0.807903 9.43196C1.09086 10.8545 1.78929 12.1612 2.81488 13.1868C3.84046 14.2123 5.14714 14.9108 6.56967 15.1937C7.99219 15.4767 9.46668 15.3315 10.8067 14.7764C12.1467 14.2214 13.292 13.2814 14.0978 12.0755C14.9036 10.8695 15.3337 9.4517 15.3337 8.0013C15.3337 6.05638 14.561 4.19112 13.1858 2.81585C11.8105 1.44059 9.94525 0.667969 8.00033 0.667969ZM10.4717 10.4726C10.3466 10.5976 10.1771 10.6678 10.0003 10.6678C9.82355 10.6678 9.65401 10.5976 9.529 10.4726L7.529 8.47263C7.40396 8.34764 7.3337 8.1781 7.33366 8.0013V4.0013C7.33366 3.82449 7.4039 3.65492 7.52892 3.5299C7.65395 3.40487 7.82352 3.33464 8.00033 3.33464C8.17714 3.33464 8.34671 3.40487 8.47173 3.5299C8.59676 3.65492 8.667 3.82449 8.667 4.0013V7.7253L10.4717 9.52997C10.5966 9.65499 10.6669 9.82453 10.6669 10.0013C10.6669 10.1781 10.5966 10.3476 10.4717 10.4726Z"
        fill={color || "#F86A2F"}
      />
    </svg>
  );
};
