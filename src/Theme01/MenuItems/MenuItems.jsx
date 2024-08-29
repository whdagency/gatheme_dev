import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
// import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { tabAchat } from '../constant/page';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeAll } from '../../lib/cartSlice';
import Logo from './waiter-svgrepo-com.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { APIURL } from '../../lib/ApiKey';
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from 'react-i18next';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "@/components/extension/carousel";
// import VideoThumbnail from 'react-video-thumbnail';
import Thumbnail from "./Video-Thumbnail.webp"
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";

import callWaiterSvg from "./callWaiter.svg"
function MenuItems({ dishes, selectedTab, restoId, infoRes, tabel_id, customization }) {
  const { toast } = useToast()
  const [selectedProp, setSelectedProp] = useState(0); // initialisation de l'état avec 0
  const [searchTerm, setSearchTerm] = useState(""); // état pour stocker la valeur de la recherche
  const [updateFormState, setUpdateFormState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newtab, setNewtab] = useState([...tabAchat]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [credenzaOpen, setCredenzaOpen] = useState(false);
  const [comment, setComment] = useState("")
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedExtraToppings, setSelectedExtraToppings] = useState([]);
  const [selectedIngrediant, setSelectedIngrediant] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState(0);
  const isArabic = infoRes.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;
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
        <div key={topping.id} className="topping-section mb-5 mt-7">
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
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70 
                ${isOptionSelected ? 'transition-transform scale-105 !font-extrabold text-black' : ''}`}
                  >
                    {option.name} {option.price > 0 && `(+${option.price} ${infoRes?.currency})`}
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
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black/70 
                      ${isOptionSelected ? 'transition-transform scale-105 !font-extrabold text-black' : ''}`}
                  >
                    {option.name} {option.price > 0 && (`(+${option.price} ${infoRes?.currency})`)}
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


  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
  };
  // const spanStyle = {
  //   padding: '20px',
  //   background: '#efefef',
  //   color: '#000000'
  // }

  // const divStyle = {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundSize: 'cover',
  //   height: '400px'
  // }
  // const slideImages = [
  //   {
  //     url: 'https://images.otstatic.com/prod/26203459/3/large.jpg',
  //     caption: 'Luxury Dish 1'
  //   },
  //   {
  //     url: 'https://i.pinimg.com/564x/d1/57/db/d157dbde841b3fa8f7e5d59344469f5f.jpg',
  //     caption: 'Luxury Dish 2'
  //   },
  //   {
  //     url: 'https://i.pinimg.com/564x/25/46/f9/2546f9c337c92e940b7cbb45854020ef.jpg',
  //     caption: 'Luxury Dish 3'
  //   },

  // ];


  // Filtrer les éléments en fonction du terme de recherche
  const filteredCategories = dishes.length > 0 && dishes.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Map on the filtered categories
  // filteredCategories.map(category => {
  //   if (Array.isArray(category.images) && category.images.length > 0) {
  //     console.log('images', category.images[0]);
  //   }
  // });


  useEffect(() => {
    tabAchat.length = 0;
    tabAchat.push(...newtab);
  }, [newtab]);

  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [toppingError, setToppingError] = useState(false);
  const [toppingErrorExtra, setToppingErrorExtra] = useState(false);

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
    dispatch(addItem({ product, quantity: quantity, resto_id: restoId, comment: comment, toppings: toppings, ingredients: ingredients, extravariants: extravariants, selectedPrices: selectedPrices }));
    setIsModalOpen(false);
  };
  const [showAlert, setShowAlert] = useState(false);
  // Fonction pour afficher l'alerte
  const handleShowAlert = () => {
    setShowAlert(true);
  };
  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 5000); // 5000 millisecondes = 5 secondes
      return () => clearTimeout(timeout);
    }
  }, [showAlert]);
  async function submitOrder() {
    try {
      const notification = {
        title: "New Call For Waiter",
        status: "Waiter",
        resto_id: restoId,
        table_id: tabel_id,
      };
      const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });

      if (response) {
        console.log("Nice => ", responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }
  async function submitBille() {
    try {
      const notification = {
        title: "Asking For Bill",
        status: "Bill",
        resto_id: restoId,
        table_id: tabel_id,
      };
      const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });

      if (response) {
        console.log("Nice => ", responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }
  // const generateThumbnail = async (videoPath) => {
  //   try {
  //     const thumbnailUrl = await VideoThumbnail.getThumbnail(videoPath, {
  //       width: 300,
  //       height: 200,
  //       quality: 1,
  //     });
  //     console.log("thumbnailUrl", thumbnailUrl);
  //     return thumbnailUrl;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const searchInputRef = useRef(null);
  const [t, i18n] = useTranslation("global")

  const videoUrl = '/item2.gif';

  const [showCarousel, setShowCarousel] = useState(false);

  // const handleVideoEnded = () => {
  //   setShowCarousel(true);
  // };
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      <div className='pt-4 mx-auto w-full' style={{ backgroundColor: customization?.selectedBgColor }}>
        <form className={`md:max-w-[58%] lg:max-w-[40%] xl:max-w-[28%] w-full mx-auto px-4 pb-4 ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'} >
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className={`w-4 h-4 `} style={{ color: customization?.selectedTextColor, }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" ref={searchInputRef} id="default-search" style={{ color: customization?.selectedTextColor, '--placeholder-color': customization?.selectedTextColor }} className={`block w-full p-2 ps-10  border border-gray-300 input-placeholder rounded-[.5rem] bg-transparent  dark:bg-gray-700 dark:border-gray-600   input-height-small`} placeholder={t("menu.search_for_your_desired_food")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </form>

        <div className='overflow-x-auto md:max-w-[50%] lg:max-w-[37%] xl:max-w-[26%] mx-auto px-3'>
          <h1 className={`pb-2 text-lg text-black font-semibold ${infoRes.language == "ar" ? "text-right" : "text-left"}`} style={{ color: customization?.selectedTextColor }}>{selectedTab == "All" ? t('menu.all') : selectedTab}</h1>

          {
            customization?.selectedLayout == "theme-list"
              ?
              <div className='grid gap-5 mb-[100px]  lg:mb-[150px]'>

                {filteredCategories.length > 0 && filteredCategories.map((item, index) => {
                  const image = item?.image1;
                  const imageUrl = `${APIURL}/storage/${image}`;


                  return (
                    <div className="tabs-container overflow-x-auto" key={index}>
                      <div className={`flex gap-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                        <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{ backgroundColor: customization?.selectedBgColor }} className="h-auto w-full !py-0 px-0">
                          <div key={item.id} className="relative shadow-md rounded-[10px] w-full border-gray-300 border inline-block">
                            <div
                              onClick={() => setSelectedItem(item)}
                              className="tab items-center justify-between flex flex-row h-full w-full overflow-hidden  pb-0 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
                            >
                              <img src={imageUrl} alt="Menu Icon" className="w-full object-cover rounded-[10px] h-28 max-w-28" />
                              <div className={`text-black flex justify-between items-center py-2 px-3  ${infoRes.language === 'ar' ? 'text-right ml-auto' : 'text-left mr-auto'}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}>
                                <div >
                                  <h2 className={`text-[20px] mb-0 text-left uppercase ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'} style={{ color: customization?.selectedTextColor }}>{item?.name?.slice(0, 12)}</h2>
                                  <h2 className={`text-[16px] mb-0 text-left  ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'} style={{ color: customization?.selectedTextColor }}>{item?.desc?.slice(0, 12)}</h2>
                                  <p className={`text-[14px] mb-0 text-left  ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'} style={{ color: customization?.selectedTextColor }}>{item.price + " " + infoRes?.currency} </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddItem(item, 1, [], [], [], 0);
                                  toast({
                                    title: `${item.name} ${t("not.title")}`,
                                    description: `${t("not.title")}`
                                  })
                                }}
                                style={{ backgroundColor: customization?.selectedPrimaryColor, }}
                                className="text-white leading-0 w-[40px] mr-3 h-[40px] flex items-center justify-center rounded-[8px]">
                                <AiOutlinePlus style={{ color: "#ffffff" }} />
                              </button>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )
                }
                )}

              </div>
              :
              <div className='grid grid-cols-2 gap-5 mb-[100px] lg:mb-[150px]'>

                {filteredCategories.length > 0 && filteredCategories.map((item, index) => {
                  const image = item?.image1;
                  const imageUrl = `${APIURL}/storage/${image}`;
                  return (
                    <div className="tabs-container overflow-x-auto" key={index}>
                      <div className="flex gap-4">
                        <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{ backgroundColor: !customization?.selectedBgColor, }} className="h-auto w-full !py-0 px-0 bg-transparent hover:bg-transparent">
                          <div key={item.id} className="relative rounded-[10px] w-full border-gray-300 border inline-block">
                            <div
                              onClick={() => setSelectedItem(item)}
                              className="tab items-center justify-center h-full w-full overflow-hidden p-1.5 pb-0 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
                            >
                              <img src={imageUrl} alt="Menu Icon" className="w-full object-cover rounded-[10px] h-32" />
                              <div className='text-black flex flex-col  items-start py-1 px-1'>

                                <h2
                                  className="text-sm mb-0 mt-1 text-left"
                                  style={{
                                    color: customization?.selectedTextColor, // Assuming calculateFontSize is a function you define
                                  }}
                                >
                                  {item.name.slice(0, 20)}
                                </h2>
                                <div className='flex w-full justify-between items-center'>
                                  <p className='text-xs text-left' style={{ color: customization?.selectedTextColor }}>{item.price + " " + infoRes?.currency}</p>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      const hasRequiredTopping = item.toppings.some(topping => topping.required === true);
                                      const hasRequiredExtraTopping = item.extravariants.some(extravariant => extravariant.required === true);
                                      console.log(item);
                                      if (!hasRequiredTopping && !hasRequiredExtraTopping) {
                                        e.stopPropagation();
                                        handleAddItem(item, 1, {}, {}, {}, {});
                                        toast({
                                          // title: `${item.name} ${t("not.title")}`,
                                          description: (<div className="flex  items-center">

                                            <img src={imageUrl} alt="Alert Image" className="w-[3.5rem] h-[3.5rem] mr-2 object-cover rounded-lg" />
                                            <div className='flex flex-col'>
                                              <h1>{item.name} {t("not.title")}</h1>
                                              <span>{t("not.desc")}</span>
                                            </div>

                                          </div>),

                                        })
                                      }
                                    }}
                                    style={{ backgroundColor: customization?.selectedPrimaryColor }}
                                    className="text-white self-end leading-0 w-[30px] h-[30px] flex items-center justify-center rounded-[8px]">
                                    <AiOutlinePlus style={{ color: "#ffffff" }} />
                                  </button>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )
                }
                )}
              </div>
          }
        </div>

      </div>
      <Credenza className={"!bg-white !py-0"} open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CredenzaContent className="flex flex-col max-h-full md:w-[50rem] bg-white md:justify-center">
          <ScrollArea className="h-[568px] w-full rounded-md p-0 overflow-y-auto">
            {selectedItem != null && (
              <>
                <CredenzaHeader>
                  <Carousel
                    carouselOptions={{
                      loop: true,
                    }}
                  >
                    {/* <CarouselNext className="top-1/3 -translate-y-1/3" />
      <CarouselPrevious className="top-1/3 -translate-y-1/3" /> */}
                    <CarouselMainContainer className="h-60 !p-0">
                      {selectedItem.video && (
                        <SliderMainItem className="bg-transparent !p-0">
                          <div className="outline outline-1 overflow-hidden outline-border size-full flex items-center justify-center rounded-xl bg-background">
                            <video
                              src={`${APIURL}/storage/${selectedItem.video}`}
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '300px', width: '100%' }}
                              autoPlay
                              muted
                              playsInline
                              loop
                              alt="Video slide"
                            />
                          </div>
                        </SliderMainItem>
                      )}

                      {selectedItem.image1 && (
                        <SliderMainItem key={selectedItem.video ? 1 : 2} index={selectedItem.video ? 1 : 2} className="bg-transparent !p-0">
                          <div className="outline outline-1 overflow-hidden outline-border size-full flex items-center justify-center rounded-xl bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image1}`}
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '300px', width: '100%' }}
                              alt="Slide 1"
                            />
                          </div>
                        </SliderMainItem>
                      )}

                      {selectedItem.image2 && (
                        <SliderMainItem key={selectedItem.video ? 2 : 3} index={selectedItem.video ? 2 : 3} className="bg-transparent !p-0">
                          <div className="outline outline-1 overflow-hidden outline-border size-full flex items-center justify-center rounded-xl bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image2}`}
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '300px', width: '100%' }}
                              alt="Slide 2"
                            />
                          </div>
                        </SliderMainItem>
                      )}

                      {selectedItem.image3 && (
                        <SliderMainItem key={selectedItem.video ? 3 : 4} index={selectedItem.video ? 3 : 4} className="bg-transparent !p-0">
                          <div className="outline outline-1 overflow-hidden outline-border size-full flex items-center justify-center rounded-xl bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image3}`}
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '300px', width: '100%' }}
                              alt="Slide 3"
                            />
                          </div>
                        </SliderMainItem>
                      )}

                      {selectedItem.image4 && (
                        <SliderMainItem key={selectedItem.video ? 4 : 5} index={selectedItem.video ? 4 : 5} className="bg-transparent !p-0">
                          <div className="outline outline-1 overflow-hidden outline-border size-full flex items-center justify-center rounded-xl bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image4}`}
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '300px', width: '100%' }}
                              alt="Slide 4"
                            />
                          </div>
                        </SliderMainItem>
                      )}


                    </CarouselMainContainer>
                    <CarouselThumbsContainer className='justify-center'>
                      {selectedItem.video && (
                        <SliderThumbItem index={0} className="bg-transparent ">
                          <div className="outline outline-1 outline-border overflow-hidden size-full h-full flex items-center justify-center rounded-md bg-background">
                            <img
                              src={Thumbnail} // Using the video thumbnail
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '100%', width: '100%' }}
                              alt="Video thumbnail"
                            />
                          </div>
                        </SliderThumbItem>
                      )}
                      {selectedItem.image1 && (
                        <SliderThumbItem key={(selectedItem.video ? 1 : 0)} index={(selectedItem.video ? 1 : 0)} className="bg-transparent ">
                          <div className="outline outline-1 outline-border overflow-hidden size-full h-full flex items-center justify-center rounded-md bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image1}`} // Using the video thumbnail
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '100%', width: '100%' }}
                              alt="Video thumbnail"
                            />
                          </div>
                        </SliderThumbItem>
                      )}
                      {selectedItem.image2 && (
                        <SliderThumbItem key={(selectedItem.video ? 2 : 1)} index={(selectedItem.video ? 2 : 1)} className="bg-transparent ">
                          <div className="outline outline-1 outline-border overflow-hidden size-full h-full flex items-center justify-center rounded-md bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image2}`} // Using the video thumbnail
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '100%', width: '100%' }}
                              alt="Video thumbnail"
                            />
                          </div>
                        </SliderThumbItem>
                      )}
                      {selectedItem.image3 && (
                        <SliderThumbItem key={(selectedItem.video ? 3 : 2)} index={(selectedItem.video ? 3 : 2)} className="bg-transparent ">
                          <div className="outline outline-1 outline-border overflow-hidden size-full h-full flex items-center justify-center rounded-md bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image3}`} // Using the video thumbnail
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '100%', width: '100%' }}
                              alt="Video thumbnail"
                            />
                          </div>
                        </SliderThumbItem>
                      )}
                      {selectedItem.image4 && (
                        <SliderThumbItem key={(selectedItem.video ? 4 : 3)} index={(selectedItem.video ? 4 : 3)} className="bg-transparent ">
                          <div className="outline outline-1 outline-border overflow-hidden size-full h-full flex items-center justify-center rounded-md bg-background">
                            <img
                              src={`${APIURL}/storage/${selectedItem.image4}`} // Using the video thumbnail
                              className="w-full md:h-auto rounded-md object-cover"
                              style={{ height: '100%', width: '100%' }}
                              alt="Video thumbnail"
                            />
                          </div>
                        </SliderThumbItem>
                      )}

                    </CarouselThumbsContainer>
                  </Carousel>
                </CredenzaHeader>
                <CredenzaBody className="space-y-4 text-center mt-2 sm:pb-0">
                  <CredenzaTitle>{selectedItem.name}</CredenzaTitle>
                  <span className="m-0 text-neutral-400 w-full !px-2 text-center flex justify-center items-center !mt-1">
                    {selectedItem?.desc.length > 50 && !isExpanded
                      ? selectedItem?.desc.slice(0, 50) + '...'
                      : selectedItem?.desc}
                  </span>
                  {selectedItem?.desc.length > 50 && (
                    <span
                      onClick={handleToggle}
                      className="text-muted-foreground  text-xs hover:underline "
                    >
                      {isExpanded ? 'View Less' : 'View More'}
                    </span>
                  )}
                  <div className='flex items-center mb-6 justify-center'>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => setQuantity(selectedItem.id, getQuantity(selectedItem.id) - 1)}>
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                      <span className="text-base font-medium text-gray-900 dark:text-gray-50">
                        {getQuantity(selectedItem.id)}
                      </span>
                      <Button size="icon" variant="outline" onClick={() => setQuantity(selectedItem.id, getQuantity(selectedItem.id) + 1)}>
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dot mx-1" viewBox="0 0 16 16" style={{ color: customization?.selectedPrimaryColor }}>
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                    </svg>
                    <span>{selectedItem.price + " " + infoRes?.currency}</span>
                  </div>
                  <div className='px-5'>
                    {/* renderExtraToppings */}
                    {selectedItem.toppings && renderToppings(selectedItem.toppings, selectedItem.id)}
                    {selectedItem.extravariants && renderExtraToppings(selectedItem.extravariants, selectedItem.id)}
                    {(selectedItem?.ingredients?.length > 0 && selectedItem?.ingredients != "null") && renderIngrediant(selectedItem.ingredients, selectedItem.id)}
                  </div>

                  <div className='px-3'>
                    {
                      selectedItem.isComment == 1
                        ?
                        <Textarea
                          className={`min-h-[90px] mb-3 ${infoRes.language === 'ar' ? 'text-right' : 'text-left'}`}
                          dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}
                          placeholder={t("menuAddItem.commentPlaceholder")}
                          onChange={(e) => {
                            setComment(e.target.value);
                            console.log(e.target.value);
                          }}
                        ></Textarea>
                        :
                        <></>
                    }
                  </div>
                </CredenzaBody>
                <CredenzaFooter className='grid md:justify-center items-center'>
                  <button
                    type="button"
                    onClick={() => handleAddItem(selectedItem, getQuantity(selectedItem.id), selectedToppings, selectedIngrediant, selectedExtraToppings, selectedPrices)}
                    className={`rounded-[1rem] p-2 transition-all duration-300 border font-medium text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                    style={{ backgroundColor: customization?.selectedPrimaryColor }}
                  >
                    <div className={`text-lg font-semibold text-white flex-nowrap ${infoRes.language === "ar" ? "flex-row-reverse" : "flex-row"} gap-1 ${isClicked ? "text-[#28509E]" : "text-white"} `}>
                      {t("menu.addToSelected")}
                      {(selectedItem.price * getQuantity(selectedItem.id) + selectedPrices).toFixed(2) + " " + infoRes?.currency}
                    </div>
                  </button>
                  <CredenzaClose asChild>
                    <Button variant="outline bg-black text-white">{t("menu.cancel")}</Button>
                  </CredenzaClose>
                </CredenzaFooter>
              </>
            )}
          </ScrollArea>
        </CredenzaContent>
      </Credenza>
      <AlertDialog>
        <AlertDialogTrigger asChild className={`mb-1 fixed bottom-16 right-2 md:right-[25%] lg:right-[32%] xl:right-[35%] flex-col flex items-end justify-center ${credenzaOpen ? 'hidden' : ''}`}>
          <Button className="h-16 w-16 rounded-full  shadow-lg flex items-center justify-center" size="icon" style={{ backgroundColor: customization?.selectedPrimaryColor }}>
            <img src={Logo} alt="Waiter Icon" className="h-12 w-11" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[80%] md:w-full mx-auto rounded-lg">

          <AlertDialogHeader className={`${infoRes.language === 'ar' ? ' ml-auto' : ''}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}>
            <img src={callWaiterSvg} alt="Call Waiter" />
            {/* <AlertDialogTitle>{t("waiter.CallWaiter")}</AlertDialogTitle> */}
            <AlertDialogTitle>{t("waiter.CallWaiter")}</AlertDialogTitle>
            <AlertDialogDescription>{t("waiter.please")}</AlertDialogDescription>

          </AlertDialogHeader>
          <AlertDialogFooter className='flex !flex-col !justify-center  w-full gap-2'>

            <AlertDialogAction className="w-full !px-0 bg-[#28509E]" onClick={submitOrder}>{t("waiter.CallWaiter")}</AlertDialogAction>
            <AlertDialogAction variant="outline" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full border-[#28509E] bg-white text-black !ml-0" onClick={submitBille}>{t("waiter.BringTheBill")}</AlertDialogAction>
            <AlertDialogCancel className="absolute top-1 right-2 rounded-full border-none">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
{/* <Carousel
      
showThumbs={true}

renderThumbs={() => (
  [
    videoUrl && (
      <div key="video-thumb" className="thumb-container">
        <img
          src={videoUrl}
          alt="Video Thumbnail"
          className="thumb-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ),
    ...slideImages.map((slideImage, index) => (
      <div key={index} className="thumb-container">
        <img
          src={slideImage.url}
          alt={`Thumb ${index + 1}`}
          className="thumb-image"
        />
      </div>
    ))
  ]
)}
>
{videoUrl && (
  <div>
    <img
      src={videoUrl}
      alt="GIF Slide"
      className="w-full md:h-auto rounded-md"
      style={{ height: '300px', width: '100%', objectFit: 'cover' }}
    />
  </div>
)}

{slideImages.map((slideImage, index) => (
  <div key={index}>
    <img
      src={slideImage.url}
      className="w-full md:h-auto object-cover"
      style={{ height: '300px', width: '100%' }}
      alt={`Slide ${index + 1}`}
    />
  </div>
))}
</Carousel> */}
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

function CancelIcon(props) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_1014_4547)">
        <circle cx="18" cy="18" r="11" fill="#DB281C" />
      </g>
      <defs>
        <filter id="filter0_d_1014_4547" x="0.125" y="0.125" width="35.75" height="35.75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="3.4375" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.6 0 0 0 0 0.290196 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1014_4547" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1014_4547" result="shape" />
        </filter>
      </defs>
    </svg>

  );
}
export default MenuItems;
