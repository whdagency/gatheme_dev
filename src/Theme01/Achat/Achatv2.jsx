import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { incrementQuantity, decrementQuantity, removeItem, removeAll, addItem } from '../../lib/cartSlice';
import { APIURL } from '../../lib/ApiKey';
// import StepsBar from './Steps'
import StepsBar from './stepsv2'

import './Achat.css';
import { FaPlus } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import {
  Credenza,
  CredenzaContent,
} from "@/components/ui/credenza";
import { axiosInstance } from '../../axiosInstance';
import { database, onValue, ref } from '../../firebaseConfig';
import { useMenu } from '../../hooks/useMenu';
import orderSvg from "./orderSvg.svg"
import { CheckIcon } from 'lucide-react';

import callWaiterSvg from "@/Theme01/MenuItems/callWaiter.svg"

import Logo from '@/Theme01/MenuItems/waiter-svgrepo-com.svg';
export default function Achat({ resto_id, infoRes, customization, slug, selectedDishes }) {
  const cartItems = useSelector(state => state.cart.items);

  const { tableName,
    submitBille, callWaiter } = useMenu();
  const totalCost = cartItems.reduce((total, item) => {
    // Convert item.price to a number, defaulting to 0 if it's not a valid number
    const itemPrice = parseFloat(item.price) || 0;

    // Check the type and value of item.selectedPrices
    let selectedPrices = 0;
    if (Array.isArray(item.selectedPrices)) {
      // If it's an array, sum up all the prices
      selectedPrices = item.selectedPrices.reduce((sum, price) => {
        const parsedPrice = parseFloat(price);
        return sum + (isNaN(parsedPrice) ? 0 : parsedPrice);
      }, 0);
    } else if (typeof item.selectedPrices === 'string') {
      // If it's a string, convert it to a number
      selectedPrices = parseFloat(item.selectedPrices) || 0;
    } else {
      // Handle other cases (e.g., object, null, etc.)
      console.warn('Unexpected value for selectedPrices:', item.selectedPrices);
    }

    // Calculate the total cost for this item
    const itemTotal = (itemPrice + selectedPrices) * (item.quantity || 0);

    // Log the calculated total for debugging
    console.log("Item price:", itemPrice);
    console.log("Selected prices:", selectedPrices);
    console.log("Item total:", itemTotal);

    // Accumulate the total cost
    return total + itemTotal;
  }, 0);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const extraInfo = queryParams.get('table_id');
  const table_id = extraInfo;
  const [currentStep, setCurrentStep] = useState(1);

  const isArabic = infoRes.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const [status, setStatus] = useState("")
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const modalOpenedRef = useRef(false);

  async function submitOrder(cartItems, totalCost) {
    sessionStorage.setItem('modalOpened', '');
    let cartItemProduct = cartItems.map(item => ({
      type: item.type,  // Assuming all items are dishes
      id: item.id,
      quantity: item.quantity,
      comment: item.comment ? item.comment : null,
      toppings: item.toppings,
      ingrediants: item.ingredients,
      extraVariant: item.extravariants
    })

    );

    const order = {
      total: totalCost,
      status: 'New',
      table_id: extraInfo,  // Assuming static for now, you may need to adjust this based on your app's logic
      resto_id: resto_id,   // Assuming static as well, adjust accordingly
      cartItems: cartItemProduct
    };
    console.log("The orde is ", order);
    try {
      const response = await fetch(`https://backend.garista.com/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorResponse}`);
      }

      const responseData = await response.json();
      console.log('Order submitted:', responseData?.order?.id);
      localStorage.setItem('orderID', JSON.stringify(responseData?.order?.id))
      const id = JSON.stringify(responseData?.order?.id)

      if (response) {
        const notification = {
          title: "New Order",
          status: "Order",
          resto_id: resto_id,
          table_id: extraInfo,
        };
        const formData = new FormData();
        formData.append("title", "New Order");
        formData.append("status", "Order");
        formData.append("resto_id", resto_id);
        const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });

        console.log("Nice => ", responseNotification);
        setOrderSuccessModalOpen(false);
        setIsModalOpen(false)
        setOrderID(id)
        dispatch(removeAll())
      }

    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
    setOrderSubmitted(true);
  }

  const [t, i18n] = useTranslation("global")
  const [activeIndex, setActiveIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [orderID, setOrderID] = useState("");
  // const [selectedDishes, setSelectedDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchValues = async () => {
    try {
      // const response = await axiosInstance.get('/api/suggestions/'+resto_id);

      // const suggestions = response.data;

      // // // Extract dishes from suggestions
      // const initialSelectedDishes = suggestions
      // .filter(suggestion => suggestion.dishes) // Only take suggestions with dishes
      // .map(suggestion => suggestion.dishes);

      // const initialSelectedDrinks = suggestions
      // .filter(suggestion => suggestion.drinks) // Only take suggestions with dishes
      // .map(suggestion => suggestion.drinks);

      // // const ComindeSelected = [...initialSelectedDishes, ...initialSelectedDrinks]
      // let ComindeSelected = [];
      // if (initialSelectedDishes.length) {
      //   ComindeSelected.push(...initialSelectedDishes.map(item => ({ ...item, type: 'dish' })));
      // }
      // if (initialSelectedDrinks.length) {
      //   ComindeSelected.push(...initialSelectedDrinks.map(item => ({ ...item, type: 'drink' })));
      // }
      // const filteredSuggestions = ComindeSelected.filter(suggestion => {
      //   return !cartItems.some(cartItem => cartItem.id === suggestion.id && cartItem.type === suggestion.type);
      // });
      // setSelectedDishes(filteredSuggestions);

      const res = localStorage.getItem('orderID');
      setOrderID(res)
      const result = await axiosInstance.get('/api/orders/' + res)
      console.log("The Response of RestoInfo => ", resto_id);
      const data = result?.data?.order
      if (result) {

        setStatus(data?.status)
        if (data?.status == "new") {
          setCurrentStep(1);
          setComplete(false)
        }
        else if (data?.status == "Processing") {
          setCurrentStep(2)
          setComplete(false)
        }
        else if (data?.status == "Completed") {
          setCurrentStep(4);
          setComplete(true);
          localStorage.setItem('orderID', null)
        }
        else if (data?.status == "Canceled") {
          setCurrentStep(3);
          setCanceled(true);
          localStorage.setItem('orderID', null)
        }
      }

    }
    catch (err) {
      console.log("The Error => ", err);
    }
  }

  const subscribeToFirebase = () => {
    const ordersRef = ref(database, "orders");
    onValue(ordersRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        fetchValues()
      }
    });
  };



  useEffect(() => {
    fetchValues();
    subscribeToFirebase()
  }, [])

  useEffect(() => {
    const OpenModel = async () => {
      const modalAlreadyOpened = sessionStorage.getItem('modalOpened');
      if (!modalAlreadyOpened && cartItems.length > 0 && selectedDishes.length > 0) {
        setIsModalOpen(true);
        sessionStorage.setItem('modalOpened', 'true');
      }

      else if (cartItems.length == 0) {
        sessionStorage.setItem('modalOpened', '');
      }
    }
    OpenModel()
  }, [cartItems])


  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
    const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

    return (
      <span
        className="inline-flex items-center justify-center border-circle border-primary border-1 h-12 w-12 z-10 cursor-pointer"
        style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-25px' }}
        onClick={() => setActiveIndex(itemIndex)}
      >
        <i className={`${item.icon} text-xl`} />
      </span>
    );
  };

  return (
    <>
      <div className={`bg-white snap-y scrollbar-hide dark:bg-gray-950 p-2 pt-4 rounded-lg shadow-lg max-w-[620px] mx-auto ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
        <div className="flex flex-col justify-center ">
          {orderID != 'null' &&
            <StepsBar
              status={status}
              orderID={orderID}
              currentStep={currentStep}
              infoRes={infoRes}
              complete={complete}
              cartItems={cartItems}
              totalCost={totalCost}
              canceled={canceled}
            />
          }
        </div>



        <div className="flex flex-col gap-4  snap-y  scrollbar-hide">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50" >{t("achat.shoppingCart")}<span className="text-xs text-muted-foreground capitalize font-normal"> {t("achat.ofTable")}: {tableName}</span></h2>
            {/* <button style={{backgroundColor: customization?.selectedPrimaryColor,color: customization?.selectedTextColor}} onClick={() => dispatch(removeAll())} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              <h1 className='mix-blend-difference' style={{color: customization?.selectedTextColor}}>
              {t("achat.clearBtn")}
              </h1>
            </button> */}
            <button onClick={() => { sessionStorage.setItem('modalOpened', ''); dispatch(removeAll()) }} className="text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              {/* <h1 className='mix-blend-difference' style={{color: customization?.selectedTextColor}}> */}
              {t("achat.clearBtn")}
              {/* </h1> */}
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-44 flex-shrink-0 relative flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="90" height="20" viewBox="0 0 55 20" fill="none" className="mt-0 ">
                    <path opacity="0.7" d="M1.5 6.30273L12.5996 18.7559M53.5996 6.30273L42.5 18.7559L53.5996 6.30273ZM27.5 2V18.7559V2Z" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 251 200" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M63.5 134H154.5C155.015 134 155.517 133.944 156 133.839C156.483 133.944 156.985 134 157.5 134H209.5C213.366 134 216.5 130.866 216.5 127C216.5 123.134 213.366 120 209.5 120H203.5C199.634 120 196.5 116.866 196.5 113C196.5 109.134 199.634 106 203.5 106H222.5C226.366 106 229.5 102.866 229.5 99C229.5 95.134 226.366 92 222.5 92H200.5C204.366 92 207.5 88.866 207.5 85C207.5 81.134 204.366 78 200.5 78H136.5C140.366 78 143.5 74.866 143.5 71C143.5 67.134 140.366 64 136.5 64H79.5C75.634 64 72.5 67.134 72.5 71C72.5 74.866 75.634 78 79.5 78H39.5C35.634 78 32.5 81.134 32.5 85C32.5 88.866 35.634 92 39.5 92H64.5C68.366 92 71.5 95.134 71.5 99C71.5 102.866 68.366 106 64.5 106H24.5C20.634 106 17.5 109.134 17.5 113C17.5 116.866 20.634 120 24.5 120H63.5C59.634 120 56.5 123.134 56.5 127C56.5 130.866 59.634 134 63.5 134ZM226.5 134C230.366 134 233.5 130.866 233.5 127C233.5 123.134 230.366 120 226.5 120C222.634 120 219.5 123.134 219.5 127C219.5 130.866 222.634 134 226.5 134Z" fill="#F3F7FF" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" width="73" height="91" viewBox="0 0 73 91" fill="none" className="absolute inset-0 m-auto">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.29757 2H66.9041L61.2976 10.4098L68.773 16.0164H2.42871L10.8385 10.4098L4.29757 2Z" fill="#E8F0FE" />
                    <rect x="0.5" y="14" width="71" height="75" rx="2" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.08521 55.006V20.6453C5.08521 19.2296 6.24544 18.082 7.67666 18.082L68.6533 82.1642C68.6533 84.0518 67.1423 85.582 65.2784 85.582H8.46013C6.59621 85.582 5.08521 84.0518 5.08521 82.1642V69.3945V65.9301V55.006ZM5.08521 62.4247V58.5765V62.4247Z" fill="#E8F0FE" />
                    <path d="M1.5 55.4631V17.8853C1.5 16.337 2.77049 15.082 4.33773 15.082H69.2612C70.2817 15.082 71.109 15.9187 71.109 16.9508V85.1639C71.109 87.2282 69.4544 88.9016 67.4134 88.9016H5.19564C3.15459 88.9016 1.5 87.2282 1.5 85.1639V71.1986V67.4098M1.5 63.5763V59.3678" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M3.36311 15.082V3.86886C3.36311 2.83672 4.11401 2 5.04029 2L67.0958 2C68.0221 2 68.7729 2.83672 68.7729 3.86886V15.082" stroke="#28509E" strokeWidth="2.5" />
                    <path d="M20.6499 34.7049C22.4561 34.7049 23.9204 33.2407 23.9204 31.4344C23.9204 29.6282 22.4561 28.1639 20.6499 28.1639C18.8436 28.1639 17.3794 29.6282 17.3794 31.4344C17.3794 33.2407 18.8436 34.7049 20.6499 34.7049Z" fill="#E8F0FE" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M51.4861 34.7049C53.2923 34.7049 54.7566 33.2407 54.7566 31.4344C54.7566 29.6282 53.2923 28.1639 51.4861 28.1639C49.6798 28.1639 48.2156 29.6282 48.2156 31.4344C48.2156 33.2407 49.6798 34.7049 51.4861 34.7049Z" fill="#E8F0FE" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M51.0188 34.7049C51.0188 42.962 44.3251 49.6557 36.068 49.6557C27.8109 49.6557 21.1172 42.962 21.1172 34.7049" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M4.3545 2.93146L10.9329 9.42513C11.3259 9.81311 11.3301 10.4463 10.9421 10.8393C10.8749 10.9073 10.7984 10.9654 10.7148 11.0117L3.36304 15.082" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M67.9401 2.99922L61.6451 9.41968C61.2585 9.81404 61.2647 10.4472 61.6591 10.8338C61.7249 10.8984 61.7994 10.9535 61.8803 10.9977L69.3674 15.082" stroke="#28509E" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>

                </div>
                <div className='font-semibold text-center mt-2 '>
                  <p className='text-xl'>{t("achat.emptycart")}</p>
                  <p className="text-gray-500 text-center mt-2 text-xl dark:text-gray-400">
                    {t("achat.checkout")}
                  </p>
                  <Link to={`/menu/${slug}?table_id=${table_id}`}>
                    <p className=" text-center mt-2 text-lg dark:text-gray-400 " style={{ color: customization?.selectedPrimaryColor }}>
                      <FaPlus size={15} className="inline-block mr-1" />  {t("achat.addmoreitems")}
                    </p>
                  </Link>

                </div>

              </div>
              <div className="flex justify-between items-center mt-16 ">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("achat.total")}:
                  <span className="font-medium text-gray-900 dark:text-gray-50"> {totalCost?.toFixed(2) + " " + infoRes.currency}</span>
                </p>
                <Button onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)} style={{ backgroundColor: customization?.selectedPrimaryColor }} className="py-2 px-4 rounded-lg" size="lg" disabled>
                  {t("achat.checkoutBtn")}
                </Button>
              </div></div>



          ) : (
            <>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} infoRes={infoRes} />
              ))}
              <div className="flex justify-between items-center mb-12">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("achat.total")}:
                  <span className="font-medium text-gray-900 dark:text-gray-50"> {totalCost?.toFixed(2) + " " + infoRes.currency}</span>
                </p>
                <Button onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)} style={{ backgroundColor: customization?.selectedPrimaryColor }} className="py-2 px-4 rounded-lg" size="lg">
                  {t("achat.checkoutBtn")}
                </Button>
              </div>
            </>
          )}
        </div>
        <AlertDialog
          open={orderSuccessModalOpen}
          onOpenChange={setOrderSuccessModalOpen}
          className={` !pl-0 !pr-0 ${isArabic === 'ar' ? 'text-right ' : 'text-left'}  `}
          dir={direction}
        >
          <AlertDialogContent
            className={`w-[80%] rounded-lg place-items-center ${isArabic === 'ar' ? 'sm:text-right ml-auto' : 'text-left'}`}
            dir={direction}
          >
            <AlertDialogHeader
              className={`w-[80%]  rounded-lg place-items-center ${infoRes.language === 'ar' ? 'flex flex-row-reverse sm:text-right' : ''
                }`}
              dir={direction}
            >
              <button
                className="absolute top-2 right-2 p-2 rounded-full  text-gray-600"
                onClick={() => setOrderSuccessModalOpen(false)} // Close the dialog
              >
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
              </button>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="113" height="112" viewBox="0 0 113 112" fill="none">
                <path d="M26.05 44.905C26.1148 46.6398 25.6109 48.3481 24.615 49.77C24.3551 50.1552 24.2589 50.6279 24.3475 51.0841C24.4361 51.5403 24.7023 51.9426 25.0875 52.2025C25.4727 52.4624 25.9454 52.5587 26.4016 52.4701C26.8578 52.3814 27.2601 52.1152 27.52 51.73C28.904 49.7282 29.615 47.3378 29.55 44.905C29.5819 41.8231 28.4508 38.8425 26.3825 36.5575C24.8119 34.8596 23.9395 32.6317 23.9395 30.3188C23.9395 28.0058 24.8119 25.7779 26.3825 24.08L26.5925 23.8175C26.7438 23.636 26.8567 23.4256 26.9245 23.1993C26.9923 22.9729 27.0135 22.7351 26.9869 22.5003C26.9603 22.2655 26.8864 22.0385 26.7697 21.833C26.653 21.6275 26.4959 21.4478 26.3078 21.3047C26.1198 21.1615 25.9047 21.058 25.6755 21.0003C25.4464 20.9426 25.2079 20.9318 24.9745 20.9688C24.7411 21.0057 24.5175 21.0896 24.3174 21.2152C24.1173 21.3409 23.9447 21.5058 23.81 21.7L23.6 21.9625C21.5589 24.2745 20.4325 27.2523 20.4325 30.3363C20.4325 33.4203 21.5589 36.3981 23.6 38.71C25.1919 40.3774 26.0709 42.5998 26.05 44.905ZM43.55 44.905C43.6148 46.6398 43.1109 48.3481 42.115 49.77C41.8551 50.1552 41.7588 50.6279 41.8475 51.0841C41.9361 51.5403 42.2023 51.9426 42.5875 52.2025C42.9727 52.4624 43.4454 52.5587 43.9016 52.4701C44.3578 52.3814 44.7601 52.1152 45.02 51.73C46.404 49.7282 47.115 47.3378 47.05 44.905C47.0819 41.8231 45.9508 38.8425 43.8825 36.5575C42.3119 34.8596 41.4395 32.6317 41.4395 30.3188C41.4395 28.0058 42.3119 25.7779 43.8825 24.08L44.0925 23.8175C44.2438 23.636 44.3567 23.4256 44.4245 23.1993C44.4923 22.9729 44.5135 22.7351 44.4869 22.5003C44.4603 22.2655 44.3864 22.0385 44.2697 21.833C44.153 21.6275 43.9959 21.4478 43.8078 21.3047C43.6198 21.1615 43.4047 21.058 43.1755 21.0003C42.9464 20.9426 42.7079 20.9318 42.4745 20.9688C42.2411 21.0057 42.0175 21.0896 41.8174 21.2152C41.6173 21.3409 41.4447 21.5058 41.31 21.7L41.1 21.9625C39.0589 24.2745 37.9325 27.2523 37.9325 30.3363C37.9325 33.4203 39.0589 36.3981 41.1 38.71C42.6919 40.3774 43.5709 42.5998 43.55 44.905ZM81 57.75H18C17.5359 57.75 17.0908 57.9344 16.7626 58.2626C16.4344 58.5908 16.25 59.0359 16.25 59.5V84C16.25 88.6413 18.0937 93.0925 21.3756 96.3744C24.6575 99.6563 29.1087 101.5 33.75 101.5V105C33.75 105.464 33.9344 105.909 34.2626 106.237C34.5907 106.566 35.0359 106.75 35.5 106.75H63.5C63.9641 106.75 64.4092 106.566 64.7374 106.237C65.0656 105.909 65.25 105.464 65.25 105V101.5C69.8913 101.5 74.3425 99.6563 77.6244 96.3744C80.9062 93.0925 82.75 88.6413 82.75 84V59.5C82.75 59.0359 82.5656 58.5908 82.2374 58.2626C81.9092 57.9344 81.4641 57.75 81 57.75ZM61.75 103.25H37.25V101.5H61.75V103.25ZM79.25 84C79.25 87.713 77.775 91.274 75.1495 93.8995C72.524 96.525 68.963 98 65.25 98H33.75C30.037 98 26.476 96.525 23.8505 93.8995C21.225 91.274 19.75 87.713 19.75 84V61.25H79.25V84ZM96.2425 20.615L81.385 5.75751C81.0571 5.43157 80.6136 5.24863 80.1512 5.24863C79.6889 5.24863 79.2454 5.43157 78.9175 5.75751L56.64 28C56.3141 28.3279 56.1311 28.7714 56.1311 29.2338C56.1311 29.6961 56.3141 30.1396 56.64 30.4675L66.4225 40.25C66.7485 40.5733 67.1884 40.7556 67.6475 40.7575H77.71C77.9403 40.7589 78.1686 40.7147 78.3818 40.6276C78.595 40.5405 78.789 40.4122 78.9525 40.25L96.2425 22.96C96.5327 22.6384 96.6934 22.2207 96.6934 21.7875C96.6934 21.3543 96.5327 20.9366 96.2425 20.615ZM76.9925 37.38H68.3825L60.35 29.2775L80.1425 9.46751L92.515 21.84L76.9925 37.38Z" fill="black" />
                <path d="M74 47.25C74.9665 47.25 75.75 46.4665 75.75 45.5C75.75 44.5335 74.9665 43.75 74 43.75C73.0335 43.75 72.25 44.5335 72.25 45.5C72.25 46.4665 73.0335 47.25 74 47.25Z" fill="black" />
                <path d="M72.25 52.5C73.2165 52.5 74 51.7165 74 50.75C74 49.7835 73.2165 49 72.25 49C71.2835 49 70.5 49.7835 70.5 50.75C70.5 51.7165 71.2835 52.5 72.25 52.5Z" fill="black" />
                <path d="M68.75 45.5C69.7165 45.5 70.5 44.7165 70.5 43.75C70.5 42.7835 69.7165 42 68.75 42C67.7835 42 67 42.7835 67 43.75C67 44.7165 67.7835 45.5 68.75 45.5Z" fill="black" />
                <path d="M68.75 56C69.7165 56 70.5 55.2165 70.5 54.25C70.5 53.2835 69.7165 52.5 68.75 52.5C67.7835 52.5 67 53.2835 67 54.25C67 55.2165 67.7835 56 68.75 56Z" fill="black" />
                <path d="M75.75 56C76.7165 56 77.5 55.2165 77.5 54.25C77.5 53.2835 76.7165 52.5 75.75 52.5C74.7835 52.5 74 53.2835 74 54.25C74 55.2165 74.7835 56 75.75 56Z" fill="black" />
                <path d="M67 50.75C67.9665 50.75 68.75 49.9665 68.75 49C68.75 48.0335 67.9665 47.25 67 47.25C66.0335 47.25 65.25 48.0335 65.25 49C65.25 49.9665 66.0335 50.75 67 50.75Z" fill="black" />
                <path d="M63.5 56C64.4665 56 65.25 55.2165 65.25 54.25C65.25 53.2835 64.4665 52.5 63.5 52.5C62.5335 52.5 61.75 53.2835 61.75 54.25C61.75 55.2165 62.5335 56 63.5 56Z" fill="black" />
                <path d="M71.0074 26.04C70.6727 25.7533 70.242 25.6035 69.8016 25.6205C69.3612 25.6375 68.9434 25.8201 68.6317 26.1318C68.32 26.4434 68.1375 26.8612 68.1204 27.3017C68.1034 27.7421 68.2532 28.1727 68.5399 28.5075L73.4924 33.46C73.8272 33.7467 74.2578 33.8965 74.6983 33.8795C75.1387 33.8625 75.5565 33.6799 75.8682 33.3682C76.1798 33.0566 76.3624 32.6388 76.3794 32.1983C76.3964 31.7579 76.2466 31.3273 75.9599 30.9925L71.0074 26.04Z" fill="black" />
              </svg> */}
              <img src={orderSvg} alt="Order" />
              <AlertDialogTitle>{t("achat.successOrder")}</AlertDialogTitle>
              <AlertDialogDescription>{t("achat.thankYou")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row gap-4 justify-center">
              <AlertDialogAction style={{ backgroundColor: customization?.selectedPrimaryColor }} autoFocus onClick={() => submitOrder(cartItems, totalCost)}>
                {t("menu.ok")}
              </AlertDialogAction>
              <Button style={{ borderColor: customization?.selectedPrimaryColor }} autoFocus onClick={() => setOrderSuccessModalOpen(false)} variant="outline" >
                {t("menu.cancel")}
              </Button>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Credenza className="!bg-white  !py-0" open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CredenzaContent className="flex max-h-[70%]  md:w-[50rem] bg-white md:flex-col md:justify-center md:items-center">
          <div className="mt-10 mb-1 text-center text-lg font-medium text-black">
            Suggested Products
          </div>
          <div className="grid grid-cols-2 gap-0 p-2 mb-3 ">
            {selectedDishes?.slice(0, 4).map((item, index) => (
              <CartItemSuggestion
                key={index}
                item={item}
                infoRes={infoRes}
                customization={customization}
                resto_id={resto_id}
              />
            ))}
          </div>
        </CredenzaContent>
      </Credenza>
      <AlertDialog>
        <AlertDialogTrigger asChild className={`mb-1 fixed bottom-16 right-2 md:right-[25%] lg:right-[32%] xl:right-[35%] flex-col flex items-end justify-center `}>
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

            <AlertDialogAction className="w-full !px-0  " style={{ backgroundColor: customization?.selectedPrimaryColor }} onClick={callWaiter}>{t("waiter.CallWaiter")}</AlertDialogAction>
            <AlertDialogAction variant="outline" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full  bg-white text-black !ml-0" style={{ borderColor: customization?.selectedPrimaryColor }} onClick={submitBille}>{t("waiter.BringTheBill")}</AlertDialogAction>
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

const ToppingOptions = ({ item }) => {
  // Flatten all options into a single array
  const options = item?.toppings?.length > 0 && item?.toppings?.flatMap(topping =>
    topping.option.map(opt => ({
      name: opt.name,
      price: opt.price,
    })
    )
  )

  return (
    <div>
      {options?.length > 0 && (
        <div className="text-md mt-4">
          {options.map((opt, index) => (
            <span key={opt.name} className='text-gray-400 !font-[300] text-[14px]'>
              {opt.name}
              {index < options.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const ExtraOptions = ({ item }) => {
  // Flatten all options into a single array
  const options = item?.extravariants?.length > 0 && item?.extravariants?.flatMap(topping =>
    topping.option.map(opt => ({
      name: opt.name,
      price: opt.price,
    }))
  );
  return (
    <div>
      {options?.length > 0 && (
        <div className="text-md">
          {options.map((opt, index) => (
            <span key={opt.name} className='text-gray-400 !font-[300] text-[14px]'>
              {opt.name}
              {index < options.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const IngredientsOption = ({ item }) => {
  // Directly use the ingredients array
  const ingredients = item?.ingredients ?? [];
  return (
    <div>
      {ingredients.length > 0 && (
        <div className="text-md">
          {ingredients.map((ingredient, index) => (
            <span key={ingredient.name} className='text-gray-400 !font-[300] text-[14px]'>
              {ingredient.name}
              {index < ingredients.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

function CartItem({ item, infoRes }) {
  const dispatch = useDispatch();
  // let images = [];
  // try {
  //   images = JSON.parse(item?.images) || [];
  // } catch (error) {
  //   console.error("Error parsing images: ", error);
  // }

  const imageUrl = `${APIURL}/storage/${item.image1}` // Add a default image path if necessary
  const price = parseFloat(item.price);
  const selectedPrices = parseFloat(item.selectedPrices) || 0;
  const quantity = parseInt(item.quantity, 10);

  const subtotal = (price + selectedPrices) * quantity;
  return (
    <div className="grid gap-4">
      <div className=" bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div className='flex items-center gap-2'>
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img
              alt={item.name}
              className="w-full h-full object-cover"
              height={64}
              src={imageUrl}
              style={{
                aspectRatio: '64/64',
                objectFit: 'cover',
              }}
              width={64}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">{item.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{subtotal.toFixed(2) + " " + infoRes.currency}</p>
            <span className="text-[12px] font-medium text-gray-900 dark:text-gray-50">{item?.comment?.length > 15 ? item?.comment?.slice(0, 10) + '...' : item?.comment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => dispatch(decrementQuantity(item.id))} size="icon" variant="outline">
              <MinusIcon className="w-4 h-4" />
            </Button>
            <span className="text-base font-medium text-gray-900 dark:text-gray-50">{item.quantity}</span>
            <Button onClick={() => dispatch(incrementQuantity(item.id))} size="icon" variant="outline">
              <PlusIcon className="w-4 h-4" />
            </Button>

          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => dispatch(removeItem(item.id))}
            className="text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

        <ToppingOptions item={item} />
        <ExtraOptions item={item} />
        <IngredientsOption item={item} />
      </div>
    </div>
  );
}

function CartItemSuggestion({ item, infoRes, customization, resto_id }) {
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const handleClick = () => {
    handleAddItem();
    setIsAdded(true);
  };
  const handleAddItem = () => {
    dispatch(addItem({ product: item, quantity: quantities, resto_id: resto_id, toppings: [], ingredients: [], extravariants: [] }));
  };
  return (
    <div className="grid gap-1">
      <div className=" dark:bg-gray-800 p-4 rounded-lg">
        <div className='flex flex-col justify-center items-center gap-2'>
          <div className="w-28 flex justify-center  relative">
            <img
              alt={item.name}
              className=" object-cover rounded-xl"
              height={150}
              src={`${APIURL}/storage/${item.image1}`}
              style={{
                aspectRatio: '150/150',
                objectFit: 'cover',
              }}
              width={150}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleClick}
              style={{ backgroundColor: customization?.selectedPrimaryColor }}
              className={`transition-transform h-8 w-8 absolute bottom-0 right-0 ${isAdded ? 'scale-110' : ''}`}
            >
              {isAdded ? (
                <CheckIcon className="w-4 h-4  text-white" />
              ) : (
                <PlusIcon className="w-4 h-4  text-white" />
              )}
            </Button>
          </div>

          <div className="flex flex-col self-start ml-6 ">
            <div className='text-left'>
              <p className=" font-medium -900 text-sm  dark:text-gray-50">{item.name}</p>
              <h3 className=" text-gray-700 font-semibold text-base dark:text-gray-400 mb-1">{item.price + " " + infoRes.currency}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
