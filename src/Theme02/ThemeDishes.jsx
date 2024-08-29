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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea";
import { FaCheck } from 'react-icons/fa';

import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
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
          className="hover:bg-black rounded-sm hover:no-underline flex flex-row items-center justify-between w-full px-3 py-2 text-white uppercase bg-black border-0"
        >
          {category.name}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-1 pt-4 border-0">
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
  const [toppingError, setToppingError] = useState(false);
  const [toppingErrorExtra, setToppingErrorExtra] = useState(false);

  const [comment, setComment] = useState("")
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedExtraToppings, setSelectedExtraToppings] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState(0);
  const [selectedIngrediant, setSelectedIngrediant] = useState([]);
  const dispatch = useDispatch();

  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;
  const updateSelectedPrices = (price) => {
    const floatPrice = parseFloat(price);

    setSelectedPrices(prevTotal => prevTotal + floatPrice);
  };
  // Set quantity
  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
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
  const handleExtraToppingSelect = (topping, option, dishId) => {
    setToppingErrorExtra(false)
    setSelectedExtraToppings(prevSelected => {
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
  const handleIngrediantSelect = (topping, dishId) => {
    setSelectedIngrediant(prevSelected => {
      const dishIngrediants = prevSelected[dishId] || [];
      const toppingKey = `${topping.name}`;
      const isSelected = dishIngrediants.includes(toppingKey);
      if (isSelected) {
        // Remove topping from selected list
        return {
          ...prevSelected,
          [dishId]: dishIngrediants.filter(name => name !== toppingKey)
        };
      } else {
        // Add topping to selected list
        return {
          ...prevSelected,
          [dishId]: [...dishIngrediants, toppingKey]
        };
      }
    });
  };



  const renderToppings = (toppings, dishId) => {
    const dishIngrediants = selectedToppings[dishId] || [];
    return toppings?.map(topping => {
      const options = JSON.parse(topping.options);
      // const isDisabled = existingTopping && !topping.multiple_selection;
      const isRequired = topping.required;
      return (
        <div key={topping.id} className="topping-section mb-5 mt-3">
          <div className={`flex items-center gap-2 `}>
            <h3 className="text-left font-bold capitalize text-[18px]">{topping.name}</h3>
            {topping.required && (
              <span className={` px-2 py-[2px] !font-[300] text-[12px] rounded-full text-white ${toppingError ? "bg-red-600" : "bg-[#28509E]"}`}>Required</span>
            )}
          </div>
          {options.map(option => {
            // const isOptionSelected = existingTopping && existingTopping.option.some(opt => opt.name === option.name);
            let toppingKey = `${topping.name}`;
            const isOptionSelected = dishIngrediants?.some(ingredient =>
              ingredient?.option?.some(opt => opt.name === option.name)
            );
            // const isOptionSelected = dishIngrediants.includes(toppingKey);
            return (
              <div key={option.name} className="flex items-center justify-start mx-3 mt-[7px] gap-3">
                <div className="flex items-center justify-between w-full">
                  <label
                    htmlFor={option.name}
                    onClick={() => handleToppingSelect(topping, option, dishId)}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70 
                ${isOptionSelected ? 'transition-transform scale-105 !font-extrabold text-black' : ''}`}
                  >
                    {option.name} {option.price > 0 && `(+${option.price} ${resInfo?.currency})`}
                  </label>
                  <button
                    type="button"
                    className={`rounded-full border h-7 w-7 p-0 flex items-center justify-center ${isOptionSelected ? 'bg-[#63aa08]' : 'border-gray-300'}`}
                    onClick={() => handleToppingSelect(topping, option, dishId)}
                    style={{
                      color: customization?.selectedTextColor,
                      backgroundColor: customization?.backgroundColor

                    }}
                  // disabled={isDisabled}
                  >
                    {/* <PlusIcon className={`w-4 h-4 ${isOptionSelected ? 'text-red-500' : ''}`} /> */}
                    {!isOptionSelected
                      ?
                      <PlusIcon className={`w-4 h-4 `}
                      />
                      :
                      <FaCheck className={`w-4 h-4 text-white`} />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  };
  const renderExtraToppings = (toppings, dishId) => {
    const dishIngrediants = selectedExtraToppings[dishId] || [];

    // console.log('The DisheIngrediants => ', dishIngrediants);
    return toppings?.map(topping => {
      const options = JSON.parse(topping.options);
      // const isDisabled = existingTopping && !topping.multiple_selection;
      return (
        <div key={topping.id} className="topping-section mb-5">
          <div className='flex items-center gap-2'>
            <h3 className="text-left font-bold capitalize text-[18px]">{topping.name}</h3>
            {topping.required && (
              <span className={` px-2 py-[2px] !font-[300] text-[12px] rounded-full text-white ${toppingErrorExtra ? "bg-red-600" : "bg-[#28509E]"}`}>Required</span>
            )}
          </div>
          {options.map(option => {
            // const isOptionSelected = existingTopping && existingTopping.option.some(opt => opt.name === option.name);
            const toppingKey = `${option.name}`;
            const isOptionSelected = dishIngrediants?.some(ingredient =>
              ingredient?.option?.some(opt => opt.name === option.name)
            );
            return (
              <div key={option.name} className="flex items-center justify-start mx-3 mt-1 gap-3">
                <div className="flex items-center justify-between w-full">
                  <label
                    htmlFor={option.name}
                    onClick={() => handleExtraToppingSelect(topping, option, dishId)}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70 
                      ${isOptionSelected ? 'transition-transform scale-105 !font-extrabold text-black' : ''}`}
                  >
                    {option.name} {option.price > 0 && (`(+${option.price} ${resInfo?.currency})`)}
                  </label>
                  <button
                    type="button"
                    className={`rounded-full border h-7 w-7 p-0 flex items-center justify-center ${isOptionSelected ? 'bg-[#63aa08]' : 'border-gray-300'}`}
                    onClick={() => handleExtraToppingSelect(topping, option, dishId)}
                  // disabled={isDisabled}
                  >
                    {/* <PlusIcon className={`w-4 h-4 ${isOptionSelected ? 'text-red-500' : ''}`} /> */}
                    {!isOptionSelected
                      ?
                      <PlusIcon className={`w-4 h-4 `}
                      />
                      :
                      <FaCheck className={`w-4 h-4 text-white`} />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  };
  const renderIngrediant = (toppings, dishId) => {
    const dishIngrediants = selectedIngrediant[dishId] || [];
    return (
      <>
        <h3 className="text-left font-bold capitalize text-[18px]">Ingrediants</h3>
        {
          toppings != "null" && toppings?.map((topping, index) => {
            // const isOptionSelected = selectedToppings.includes(topping.name);
            const toppingKey = `${topping.name}`;
            const isOptionSelected = dishIngrediants.includes(toppingKey);
            return (
              <div key={index} className="topping-section ">
                <div className="flex items-center justify-start mx-3 mt-[7px] gap-3">
                  <div className="flex items-center justify-between w-full">
                    <label
                      htmlFor={topping.name}
                      onClick={() => handleIngrediantSelect(topping, dishId)}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-300 
        ${isOptionSelected ? "line-through ml-2 text-black/40" : "ml-0 text-black/70 hover:text-black/90"} 
        transform ${isOptionSelected ? "scale-105" : "scale-100"}`}
                    >
                      {topping.name}
                    </label>
                    <button
                      type="button"
                      className={`rounded-full border p-1 flex items-center justify-center ${isOptionSelected ? 'bg-[#db281c]' : 'border-gray-300'}`}
                      onClick={() => handleIngrediantSelect(topping, dishId)}
                    // disabled={isDisabled}
                    >
                      {!isOptionSelected
                        ?
                        <MinusIcon className={`w-4 h-4 `} />
                        :
                        // <FaCheck className={`w-4 h-4 text-white`}/>
                        <IoClose size={35} className={`w-4 h-4  text-white`} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        }
      </>
    )
  };
  useEffect(() => {
    // Clear selected ingredients when the selected item changes
    setSelectedIngrediant({});
    setSelectedExtraToppings({});
    setSelectedToppings({});
    setToppingErrorExtra(false);
    setToppingError(false);
    setSelectedPrices(0)
  }, [selectedItem]);
  // Add item to cart
  // const handleAddItem = (product, quantity) => {
  //   dispatch(
  //     addItem({
  //       product,
  //       quantity: quantity,
  //       resto_id: resto_id,
  //       comment: comment,
  //     })
  //   );

  //   setComment("");

  //   setIsModalOpen(false);
  // };
  const handleAddItem = (product, quantity, toppings, ingredients, extravariants, selectedPrices) => {
    const requiredToppings = product.toppings.filter(topping => topping.required);
    const requiredExtraToppings = product.extravariants.filter(topping => topping.required);

    const allRequiredSelected = requiredToppings.every(topping => {
      const dishToppings = toppings[product.id] || [];
      const selectedTopping = dishToppings.find(item => item.id === topping.id);
      return selectedTopping && selectedTopping.option.length > 0;
    });

    const allRequiredSelectedExtra = requiredExtraToppings.every(topping => {
      const dishToppings = extravariants[product.id] || [];
      const selectedTopping = dishToppings.find(item => item.id === topping.id);
      return selectedTopping && selectedTopping.option.length > 0;
    });

    if (!allRequiredSelected || !allRequiredSelectedExtra) {
      setToppingError(!allRequiredSelected); // Set error state based on missing required toppings
      setToppingErrorExtra(!allRequiredSelectedExtra); // Set error state based on missing extra toppings
      return;
    }
    dispatch(addItem({ product, quantity: quantity, resto_id: resto_id, comment: comment, toppings: toppings, ingredients: ingredients, extravariants: extravariants, selectedPrices: selectedPrices }));
    setIsModalOpen(false);
  };
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Credenza
      className={"!bg-white !py-0"}
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        setComment("");
      }}
    >
      <CredenzaContent className="flex flex-col md:w-[50rem] md:justify-center">

        <ScrollArea className="max-h-[450px] w-full rounded-md p-0 overflow-y-auto">
          {selectedItem != null && (
            <>
              <CredenzaBody className="sm:pb-0 flex flex-col items-center gap-1 mt-5 text-center">
                <CredenzaTitle
                  style={{ color: customization.selectedPrimaryColor }}
                  className="text-2xl mt-5 font-bold"
                >
                  {selectedItem.name}
                </CredenzaTitle>

                <span className="m-0 text-neutral-400 !px-2 text-left self-center mx-4 flex justify-center items-center !mt-0">
                  {selectedItem?.desc.length > 50 && !isExpanded
                    ? selectedItem?.desc.slice(0, 50) + '...'
                    : selectedItem?.desc}
                </span>
                {selectedItem?.desc.length > 50 && (
                  <span
                    onClick={handleToggle}
                    className="text-muted-foreground font-normal  text-sm hover:underline "
                    style={{ color: customization.selectedPrimaryColor }}
                  >
                    {isExpanded ? 'See Less' : 'See More'}
                  </span>
                )}
                {/* <div className="px-7 flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setQuantity(
                          selectedItem.id,
                          getQuantity(selectedItem.id) - 1
                        )
                      }
                      className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded"
                    >
                      <MinusIcon
                        size={15}
                        className="text-[#37392C]  w-4 h-4"
                      // color={customization?.selectedPrimaryColor}
                      />
                    </button>

                    <p
                      style={{ color: customization?.selectedTextColor }}
                      className="text-2xl"
                    >
                      {getQuantity(selectedItem.id)}
                    </p>

                    <button
                      onClick={() =>
                        setQuantity(
                          selectedItem.id,
                          getQuantity(selectedItem.id) + 1
                        )
                      }
                      className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded"
                    >
                      <PlusIcon
                        size={15}
                        className="text-[#37392C] w-4 h-4"
                      // color={customization?.selectedPrimaryColor}
                      />
                    </button>
                  </div>

                  <span
                    style={{ color: customization?.selectedTextColor }}
                    className="text-2xl"
                  >
                    {getQuantity(selectedItem.id)}
                  </span>
                </div> */}
                <div className="flex items-center justify-between w-full px-8 gap-2">
                  <div className="space-x-4 w-32 flex items-center">
                    <Button size="icon" variant="outline" onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) - 1
                      )
                    }>
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-base font-medium text-gray-900 dark:text-gray-50">
                      {getQuantity(selectedItem.id)}
                    </span>
                    <Button size="icon" variant="outline" onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) + 1
                      )
                    }>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>


                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dot mx-1" viewBox="0 0 16 16" style={{ color: customization?.selectedPrimaryColor }}>
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  </svg>
                  <span className=" w-32">{selectedItem.price + " " + resInfo?.currency}</span>
                </div>
                <div className="flex flex-col w-full gap-1 px-5">
                  <div className='px-2'>
                    {/* renderExtraToppings */}
                    {selectedItem.toppings && renderToppings(selectedItem.toppings, selectedItem.id)}
                    {selectedItem.extravariants && renderExtraToppings(selectedItem.extravariants, selectedItem.id)}
                    {(selectedItem?.ingredients?.length > 0 && selectedItem?.ingredients != "null") && renderIngrediant(selectedItem.ingredients, selectedItem.id)}
                  </div>

                  {
                    selectedItem.isComment == 1
                      ?
                      <>
                        <h3 className="text-start px-2 text-lg font-bold text-black">
                          {t('menuAddItem.addnote')}

                        </h3>
                        <Textarea

                          name="note"
                          id="now"
                          // className={`min-h-[150px]  ${resInfo.language === 'ar' ? 'text-right' : 'text-left'}`}
                          className="border-[#E5E7EB] focus:outline-none focus:border-[#E5E7EB] text-black/90 w-full h-24 px-2 py-1  border rounded-md font-[Inter] shadow font-light"
                          // dir={resInfo.language === 'ar' ? 'rtl' : 'ltr'}
                          placeholder={t("menuAddItem.commentPlaceholder")}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                          }}
                        ></Textarea>
                      </>
                      :
                      <></>
                  }
                  {/* <textarea
                  name="note"
                  id="now"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder={t('menuAddItem.commentPlaceholder')}
                  className="border-[#E5E7EB] focus:outline-none focus:border-[#E5E7EB] text-black/90 w-full h-24 px-2 py-1  border rounded-md font-[Inter] shadow font-light"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                ></textarea> */}
                </div>


              </CredenzaBody>

              <CredenzaFooter className="md:justify-center px-4 grid items-center w-full mt-0">
                <button
                  type="button"
                  // onClick={() => handleAddItem(selectedItem, getQuantity(selectedItem.id), selectedToppings, selectedIngrediant, selectedExtraToppings)}

                  onClick={() => {
                    handleAddItem(selectedItem, getQuantity(selectedItem.id), selectedToppings, selectedIngrediant, selectedExtraToppings, selectedPrices)
                    setAddToCartClicked(true);
                    setTimeout(() => {
                      setAddToCartClicked(false);
                    }, 1000);
                  }}
                  className={`rounded-[0.5rem] p-2 transition-all w-full duration-300 border font-medium text-xs md:text-sm flex items-center justify-center gap-1 `}
                  style={{
                    backgroundColor: customization?.selectedPrimaryColor,
                    color: customization?.selectedBgColor,
                  }}
                >
                  <div
                    className={`text-lg font-normal ${addToCartClicked ? "text-primary-blue" : "text-white"
                      } `}
                  >
                    {t('menuAddItem.addToSelected')}
                    : {(
                      (selectedItem.price * getQuantity(selectedItem.id) + selectedPrices).toFixed(2) + " " + resInfo?.currency
                    )}
                  </div>
                </button>

                <CredenzaClose
                  asChild
                  className="w-fit md:w-full pb-1 mx-auto mt-2"
                >
                  <button className="text-sm text-center text-gray-400">
                    {t('menuAddItem.close')}
                  </button>
                </CredenzaClose>
              </CredenzaFooter>
            </>
          )}

        </ScrollArea>
      </CredenzaContent>
    </Credenza>
  );
};

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