import React, { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { useTranslation } from "react-i18next";

import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/cartSlice";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from "react-icons/io5";

const ThemeDishes = ({ category, dishes }) => {
  const { resInfo, customization } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  return (
    <>
      <AccordionItem value={category.id} className="border-0">
        <AccordionTrigger
          style={{
            backgroundColor: customization?.selectedPrimaryColor,
            color: customization?.selectedBgColor,
          }}
          className="hover:bg-black hover:no-underline flex flex-row items-center justify-between w-full px-3 py-2 text-white uppercase bg-black border-0 rounded"
        >
          {category.name}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4 pt-4 border-0">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => {
                setSelectedItem(dish);
                setIsModalOpen(true);
              }}
              className="hover:bg-black/5 flex flex-col gap-2 p-2 cursor-pointer"
            >
              <div
                style={{
                  color: customization.selectedPrimaryColor,
                  borderColor: customization.selectedPrimaryColor,
                }}
                className="border-b-black/40 last:border-b-0 flex items-center justify-between border-b"
              >
                <h3 className="font-bold">{dish.name}</h3>
                <p className="font-bold">
                  {dish.price} {resInfo.currency || "MAD"}
                </p>
              </div>

              <p
                style={{ color: customization.selectedSecondaryColor }}
                className="text-sm font-light leading-relaxed"
              >
                {dish.desc}
              </p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AddDishToCart
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default ThemeDishes;

const AddDishToCart = ({ isModalOpen, setIsModalOpen, selectedItem }) => {
  const { resInfo, customization, resto_id } = useMenu();
  const [quantities, setQuantities] = useState({});
  const [addToCartClicked, setAddToCartClicked] = useState(false);
  const { t, i18n } = useTranslation("global");

  const [comment, setComment] = useState("")
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState(0);
  const [selectedExtraToppings, setSelectedExtraToppings] = useState([]);
  const [selectedIngrediant, setSelectedIngrediant] = useState([]);
  const dispatch = useDispatch();

  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;

  // Set quantity
  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
  };
  const updateSelectedPrices = (price) => {
    const floatPrice = parseFloat(price);

    setSelectedPrices(prevTotal => prevTotal + floatPrice);
  };

  const handleToppingSelect = (topping, option, dishId) => {
    setToppingError(false)
    setSelectedToppings(prevSelected => {
      const dishToppings = prevSelected[dishId] || [];
      const existingTopping = dishToppings.find(item => item.id === topping.id);
      const price = option?.price; // Assuming `option` has a `price` property
      if (existingTopping) {
        const isAlreadySelected = existingTopping.option.some(opt => opt.name === option.name);
        if (isAlreadySelected) {
          // Remove the option if it is already selected
          const updatedOptions = existingTopping.option.filter(opt => opt.name !== option.name);
          const updatedTopping = { ...existingTopping, option: updatedOptions };
          const updatedDishToppings = updatedOptions.length > 0
            ? dishToppings.map(item => item.id === topping.id ? updatedTopping : item)
            : dishToppings.filter(item => item.id !== topping.id);
          // Update the selected prices
          updateSelectedPrices(-price, dishId);
          return {
            ...prevSelected,
            [dishId]: updatedDishToppings
          };
        } else {
          // Add the option if it is not selected
          if (topping.multiple_selection) {
            const updatedOptions = [...existingTopping.option, option];
            const updatedTopping = { ...existingTopping, option: updatedOptions };
            const updatedDishToppings = dishToppings.map(item =>
              item.id === topping.id ? updatedTopping : item
            );
            // Update the selected prices
            updateSelectedPrices(price, dishId);
            return {
              ...prevSelected,
              [dishId]: updatedDishToppings
            };
          } else {
            // For single selection, replace the existing option
            const previousOption = existingTopping.option[0]; // Assuming there is always one option for single selection
            const newTopping = {
              id: topping.id,
              name: topping.name,
              option: [option]
            };
            const updatedDishToppings = dishToppings.map(item =>
              item.id === topping.id ? newTopping : item
            );
            // Update the selected prices: subtract previous option's price and add new option's price
            const previousPrice = previousOption?.price || 0;
            updateSelectedPrices(price - previousPrice, dishId);
            return {
              ...prevSelected,
              [dishId]: updatedDishToppings
            };
          }
        }
      } else {
        // Add new topping with the selected option
        const newTopping = {
          id: topping.id,
          name: topping.name,
          option: [option]
        };
        // Update the selected prices
        updateSelectedPrices(price, dishId);
        return {
          ...prevSelected,
          [dishId]: [...dishToppings, newTopping]
        };
      }
    });
  };
}

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}