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
            const newTopping = {
              id: topping.id,
              name: topping.name,
              option: [option]
            };
            const updatedDishToppings = dishToppings.map(item =>
              item.id === topping.id ? newTopping : item
            );

          // Update the selected prices
          updateSelectedPrices(price, dishId);
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

  const handleExtraToppingSelect = (topping, option, dishId) => {
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
            const newTopping = {
              id: topping.id,
              name: topping.name,
              option: [option]
            };
            const updatedDishToppings = dishToppings.map(item =>
              item.id === topping.id ? newTopping : item
            );
            // Update the selected prices
            updateSelectedPrices(price, dishId);
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
  const renderToppings = (toppings, dishId) => {
    const dishIngrediants = selectedToppings[dishId] || [];



    return toppings?.map(topping => {
      const options = JSON.parse(topping.options);
      // const isDisabled = existingTopping && !topping.multiple_selection;
      return (
        <div key={topping.id} className="topping-section">
          <div className='flex items-center gap-2'>
            <h3 className="text-left font-bold capitalize text-[18px]">{topping.name}</h3>
            {topping.required && (
              <span className='bg-[#28509E] px-2 py-[2px] !font-[300] text-[12px] rounded-full text-white'>required</span>
            )}
          </div>
          {options?.length > 0 ? options?.map(option => {
            // const isOptionSelected = existingTopping && existingTopping.option.some(opt => opt.name === option.name);
            let toppingKey = `${topping.name}`;
            const isOptionSelected = dishIngrediants?.some(ingredient => 
              ingredient?.option?.some(opt => opt.name === option.name)
            );

            // const isOptionSelected = dishIngrediants.includes(toppingKey);
            return (
              <div key={option.name} className="flex items-center justify-start mx-3 mt-2 gap-3">
                <div className="flex items-center justify-between w-full">
                  <label
                    htmlFor={option.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70"
                  >
                    {option.name} {option.price > 0 && (`(+${option.price} ${resInfo?.currency})`)}
                  </label>
                  <button
                    type="button"
                    className={`rounded-full border p-1 flex items-center justify-center ${isOptionSelected ? 'bg-green-600' : 'border-gray-300'}`}
                    onClick={() => handleToppingSelect(topping, option, dishId)}
                    // disabled={isDisabled}
                  >
                    {/* <PlusIcon className={`w-4 h-4 ${isOptionSelected ? 'text-red-500' : ''}`} /> */}
                    {!isOptionSelected
                    ?
                    <PlusIcon className={`w-4 h-4 `} />
                    :
                    <FaCheck className={`w-4 h-4 text-white`}/>
                    }
                  </button>
                </div>
              </div>
            );
          }) : <></>}
        </div>
      );
    });
  };
  const renderExtraToppings = (toppings, dishId) => {
    const dishIngrediants = selectedExtraToppings[dishId] || [];

    // console.log('The DisheIngrediants => ', dishIngrediants);
    return toppings.map(topping => {
      const options = JSON.parse(topping.options);
      // const isDisabled = existingTopping && !topping.multiple_selection;
      return (
        <div key={topping.id} className="topping-section">
          <div className='flex items-center gap-2'>
            <h3 className="text-left font-bold capitalize text-[18px]">{topping.name}</h3>
            {topping.required && (
              <span className='bg-[#28509E] px-2 py-[2px] !font-[300] text-[12px] rounded-full text-white'>required</span>
            )}
          </div>
          {options.map(option => {
            // const isOptionSelected = existingTopping && existingTopping.option.some(opt => opt.name === option.name);
            const toppingKey = `${option.name}`;
            const isOptionSelected = dishIngrediants?.some(ingredient => 
              ingredient?.option?.some(opt => opt.name === option.name)
            );
            return (
              <div key={option.name} className="flex items-center justify-start mx-3 mt-2 gap-3">
                <div className="flex items-center justify-between w-full">
                  <label
                    htmlFor={option.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70"
                  >
                    {option.name} {option.price > 0 && (`(+${option.price} ${resInfo?.currency})`)}
                  </label>
                  <button
                    type="button"
                    className={`rounded-full border p-1 flex items-center justify-center ${isOptionSelected ? 'bg-green-600' : 'border-gray-300'}`}
                    onClick={() => handleExtraToppingSelect(topping, option, dishId)}
                    // disabled={isDisabled}
                  >
                    {/* <PlusIcon className={`w-4 h-4 ${isOptionSelected ? 'text-red-500' : ''}`} /> */}
                    {!isOptionSelected
                    ?
                    <PlusIcon className={`w-4 h-4 `} />
                    :
                    // <FaX className={`w-4 h-4 text-white`}/>
                    <FaCheck className={`w-4 h-4 text-white`}/>
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
          toppings != "null" && toppings.map((topping, index) => {
              // const isOptionSelected = selectedToppings.includes(topping.name);
              const toppingKey = `${topping.name}`;
              const isOptionSelected = dishIngrediants.includes(toppingKey);
              return (
                <div key={index} className="topping-section">
                      <div className="flex items-center justify-start mx-3 mt-2 gap-3">
                        <div className="flex items-center justify-between w-full">
                          <label
                            htmlFor={topping.name}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-500  ${isOptionSelected ? "line-through ml-2 text-black/40" : "ml-0 text-black/70" }`}
                          >
                            {topping.name }
                          </label>
                          <button
                            type="button"
                            className={`rounded-full border p-1 flex items-center justify-center ${isOptionSelected ? 'bg-red-600' : 'border-gray-300'}`}
                            onClick={() => handleIngrediantSelect(topping, dishId)}
                            // disabled={isDisabled}
                          >
                            {!isOptionSelected
                            ?
                            <MinusIcon className={`w-4 h-4 `} />
                            :
                            // <FaCheck className={`w-4 h-4 text-white`}/>
                            <IoCloseOutline size={35} className={`w-4 h-4 text-white`}/>
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
  
  console.log("selectedPrices", selectedPrices);
  
useEffect(() => {
    // Clear selected ingredients when the selected item changes
    setSelectedIngrediant({});
    setSelectedExtraToppings({});
    setSelectedToppings({});
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
  const handleAddItem = (product, quantity, toppings, ingredients, extravariants,selectedPrices) => {
    dispatch(addItem({ product, quantity: quantity, resto_id: resto_id, comment: comment, toppings: toppings, ingredients: ingredients, extravariants: extravariants, selectedPrices: selectedPrices}));
  setIsModalOpen(false);
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
        {selectedItem != null && (
          <>
            <CredenzaBody className="sm:pb-0 flex flex-col items-center gap-4 mt-5 text-center">
              <CredenzaTitle
                style={{ color: customization.selectedPrimaryColor }}
                className="text-2xl font-bold"
              >
                {selectedItem.name}
              </CredenzaTitle>

              <p
                style={{ color: customization.selectedSecondaryColor }}
                className="text-neutral-400 flex items-center justify-center w-full m-0 text-base font-normal text-center"
              >
                {selectedItem?.desc}
              </p>


              <div className="flex flex-col w-full gap-2 px-5">
              <div className='px-5'>
                {/* renderExtraToppings */}
                {selectedItem.toppings && renderToppings(selectedItem.toppings, selectedItem.id)}
                {selectedItem.extravariants && renderExtraToppings(selectedItem.extravariants, selectedItem.id)}
                {(selectedItem?.ingredients?.length > 0 && selectedItem?.ingredients != "null")  && renderIngrediant(selectedItem.ingredients, selectedItem.id)}
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
                      // className={`min-h-[150px]  ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`}
                  className="border-[#E5E7EB] focus:outline-none focus:border-[#E5E7EB] text-black/90 w-full h-24 px-2 py-1  border rounded-md font-[Inter] shadow font-light"
                      // dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}
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

              <div className="px-7 flex items-center justify-between w-full">
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
                  className="text-2xl font-bold"
                  style={{ color: customization?.selectedPrimaryColor }}
                >
                  {selectedItem.price + " " + resInfo?.currency}
                </span>
              </div>
            </CredenzaBody>

            <CredenzaFooter className="md:justify-center px-9 grid items-center w-full mt-2">
              <button
                type="button"
                // onClick={() => handleAddItem(selectedItem, getQuantity(selectedItem.id), selectedToppings, selectedIngrediant, selectedExtraToppings)}

                onClick={() => {
                  handleAddItem(selectedItem, getQuantity(selectedItem.id), selectedToppings, selectedIngrediant, selectedExtraToppings,selectedPrices)
                  setAddToCartClicked(true);
                  setTimeout(() => {
                    setAddToCartClicked(false);
                  }, 1000);
                }}
                className={`rounded-md p-2 transition-all duration-300 border font-normal text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                  color: customization?.selectedBgColor,
                }}
              >
                <div
                  className={`text-lg font-normal ${
                    addToCartClicked ? "text-primary-blue" : "text-white"
                  } `}
                >
                  {addToCartClicked
                    ? "Added To Your Cart"
                    : `${t('menuAddItem.addToSelected')}
: ${
                        (
                          selectedItem.price * getQuantity(selectedItem.id) + selectedPrices
                        ).toFixed(2) +
                        " " +
                        `${resInfo?.currency ?? "MAD"}`
                      }`}
                </div>
              </button>

              <CredenzaClose
                asChild
                className="w-fit md:w-full pb-10 mx-auto mt-4"
              >
                <button className="text-sm text-center text-gray-400">
                  {t('menuAddItem.close')}
                </button>
              </CredenzaClose>
            </CredenzaFooter>
          </>
        )}
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