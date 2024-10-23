import React from "react";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import { hexToRgba } from "../lib/utils";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const { categories, selectedCat } = useMenu();
  const { t } = useTranslation("global");

  return (
    <div className="top-[60px] sticky z-10 px-4 pt-4 bg-white">
      <div className="scrollbar-hide flex pb-2 space-x-3 overflow-x-auto">
        {categories?.map((category, index) => (
          <CategoryButton
            key={index}
            image={
              category?.name !== "All"
                ? `${STORAGE_URL}/${category?.image}`
                : "/assets/all-products.png"
            }
            label={
              category?.name === "All"
                ? t("common.actions.all")
                : category?.name
            }
            active={
              category?.name?.toLowerCase() === selectedCat?.toLowerCase()
            }
            name={category?.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;

const CategoryButton = ({ image, label, active = false, name }) => {
  const [_, setSearchParams] = useSearchParams();
  const { setSelectedCat, customization, setSearchProductTerm } = useMenu();

  const handleCategoryClick = (category) => {
    setSelectedCat(category);
    setSearchParams((prev) => {
      if (category === "All") {
        prev.delete("cat");
      } else {
        prev.set("cat", category);
      }
      prev.delete("search");
      return prev;
    });
    setSearchProductTerm("");
  };

  return (
    <button
      onClick={() => handleCategoryClick(name)}
      className={`flex w-auto items-center space-x-2 py-2 rounded-[20px] whitespace-nowrap px-4 ${
        active ? "bg-orange-500 text-white" : "bg-[#E2E4EA] text-black"
      }`}
      style={{
        background: active
          ? customization?.selectedPrimaryColor
          : hexToRgba(customization?.selectedSecondaryColor, 0.3),
      }}
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
      <span
        className="whitespace-nowrap capitalize"
        style={{
          opacity: active ? 1 : 0.8,
        }}
      >
        {label}
      </span>
    </button>
  );
};
