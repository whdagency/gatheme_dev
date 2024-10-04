import { Star, X, ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import ClipLoader from "react-spinners/ClipLoader";
import { Timer } from "../components/icons";
import AnimatedLayout from "../shared/AnimateLayout";

const Products = () => {
  const {
    products,
    resInfo,
    selectedCat,
    message,
    loading,
    searchProductTerm,
    setSearchProductTerm,
  } = useMenu();
  const pathname = useLocation().pathname;
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [isFetching, setIsFetching] = useState(false);
  const [_, setSearchParams] = useSearchParams();

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
          >
            Clear Search
          </button>
        )}

        <h2 className="font-[Poppins] top-12 absolute z-50 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-black">
          {searchProductTerm.length === 0 ? "All Products" : "Search Results"}
        </h2>

        <div className="mt-28 flex items-center justify-between mb-3">
          {/* Adjusted margin for header */}
          {searchProductTerm.length === 0 ? (
            <h2 className="text-lg font-bold capitalize">
              {selectedCat === "All" ? "Products" : selectedCat}
            </h2>
          ) : (
            <p>
              Your search term ({`"${searchProductTerm}"`}) yielded{" "}
              {products.length} result(s){" "}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <ClipLoader size={40} loading={loading} color={"#F86A2F"} />
          </div>
        ) : products.length === 0 && searchProductTerm.length > 0 ? (
          <div className="flex items-center justify-center h-64">
            No products found for this search term
          </div>
        ) : message ? (
          <div className="flex items-center justify-center h-64">
            No products found for the selected category
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
                time={product?.time || `${12} minutes`}
                price={parseFloat(product?.price)}
                currency={resInfo?.currency || "MAD"}
                id={product?.id}
              />
            ))}

            {isFetching && visibleProducts < products.length && (
              <div className="flex items-center justify-center py-4 pb-10">
                <ClipLoader size={30} loading={isFetching} color={"#F86A2F"} />
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedLayout>
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
          <h3 className="font-semibold text-black capitalize">{title}</h3>

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
