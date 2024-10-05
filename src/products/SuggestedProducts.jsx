import { CheckIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import { useCart } from "react-use-cart";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslation } from "react-i18next";

const SuggestedProducts = ({ isModalOpen, setIsModalOpen }) => {
  const { resInfo, customization, resto_id, products } = useMenu();
  const [suggestedProductsAdded, setSuggestedProductsAdded] = useState([]);
  const { items, addItem, removeItem } = useCart();
  const restoCartItems = items.filter((item) => item.resto_id === resto_id);
  const { t } = useTranslation("global");

  const suggestedProducts =
    restoCartItems.length > 0
      ? products?.filter((prod) =>
          restoCartItems.every((item) => item.id !== prod.id)
        )
      : products;

  const addSuggested = (item) => {
    setSuggestedProductsAdded((prev) => {
      // Check if the product is already in the list
      if (prev.includes(item.id)) {
        // Remove product from cart and state
        removeItem(item.id);
        return prev.filter((id) => id !== item.id);
      }

      // If product not in the list, add it
      const itemToAdd = {
        ...item,
        extravariants:
          item?.extravariants?.length > 0
            ? item?.extravariants.map((extra) => ({
                ...extra,
                options: JSON.parse(extra.options)
                  ?.map((option) => ({
                    ...option,
                    price: isNaN(parseFloat(option?.price))
                      ? 0
                      : parseFloat(option?.price || 0),
                  }))
                  ?.filter((option) => option?.name),
              }))
            : [],
        toppings:
          item?.toppings?.length > 0
            ? item?.toppings.map((top) => ({
                ...top,
                options: JSON.parse(top.options)
                  ?.map((option) => ({
                    ...option,
                    price: isNaN(parseFloat(option?.price))
                      ? 0
                      : parseFloat(option?.price || 0),
                  }))
                  ?.filter((option) => option?.name),
              }))
            : [],
      };

      addItem(itemToAdd, 1);
      return [...prev, item.id];
    });
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <DrawerTitle className="text-lg font-semibold text-center text-black">
          {t("home.products.suggestedProducts")}
        </DrawerTitle>

        <DrawerDescription className="sr-only"></DrawerDescription>

        <div className="grid grid-cols-2 gap-0 p-2 mb-3">
          {suggestedProducts?.slice(0, 4).map((item, index) => (
            <CartItemSuggestion
              key={index}
              item={item}
              resInfo={resInfo}
              customization={customization}
              addSuggested={() => addSuggested(item)}
              suggestedProductsAdded={suggestedProductsAdded}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SuggestedProducts;

const CartItemSuggestion = ({
  item,
  resInfo,
  customization,
  addSuggested,
  suggestedProductsAdded,
}) => {
  return (
    <div className="grid gap-1">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <img
              src={`${STORAGE_URL}/${item.image1}`}
              alt={item.name}
              className="rounded-xl object-cover w-[122.219px] h-[97.54px] shadow-sm"
              onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
            />

            <button
              onClick={addSuggested}
              style={{ backgroundColor: customization?.selectedPrimaryColor }}
              className={`transition-transform flex items-center justify-center h-8 w-8 absolute bottom-0 -right-10 rounded-[7.07px] ${
                suggestedProductsAdded.includes(item.id) ? "opacity-50" : ""
              }`}
            >
              {suggestedProductsAdded.includes(item.id) ? (
                <CheckIcon className="w-4 h-4 text-white" />
              ) : (
                <PlusIcon className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-0.5 text-left">
              <p className="text-sm font-medium text-[#595757] capitalize">
                {item.name}
              </p>
              <h3 className="flex items-center gap-1 mb-1 text-base font-semibold text-black">
                {item.price}
                <span
                  className="text-[#F86A2E]"
                  style={{
                    color: customization?.selectedPrimaryColor,
                  }}
                >
                  {resInfo.currency || "MAD"}
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
