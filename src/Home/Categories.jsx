import React from "react";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import { useSearchParams } from "react-router-dom";

const Categories = () => {
  const { categories, selectedCat } = useMenu();
  return (
    <div className="px-8 mt-4 -mx-4">
      <div className="scrollbar-hide flex pb-2 space-x-3 overflow-x-auto">
        {categories?.map((category, index) => (
          <CategoryButton
            key={index}
            image={
              category?.name !== "All"
                ? `${STORAGE_URL}/${category?.image}`
                : "/assets/all-products.png"
            }
            label={category?.name}
            active={
              category?.name?.toLowerCase() === selectedCat?.toLowerCase()
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;

const CategoryButton = ({ image, label, active = false }) => {
  const [_, setSearchParams] = useSearchParams();
  const { setSelectedCat } = useMenu();

  const handleCategoryClick = (category) => {
    setSelectedCat(category);
    setSearchParams((prev) => {
      if (category === "All") {
        prev.delete("cat");
      } else {
        prev.set("cat", category);
      }
      return prev;
    });
  };

  return (
    <button
      onClick={() => handleCategoryClick(label)}
      className={`flex w-auto items-center space-x-2 py-2 rounded-[20px] whitespace-nowrap ${
        label === "All" ? "px-10" : "px-4"
      } ${active ? "bg-orange-500 text-white" : "bg-[#E2E4EA] text-black"}`}
    >
      {image && (
        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
          <img
            src={image}
            alt={label}
            className="object-cover w-6 h-6 rounded-full"
            onError={(e) =>
              (e.currentTarget.src = "/assets/placeholder-image.png")
            }
          />
        </div>
      )}
      <span>{label}</span>
    </button>
  );
};
