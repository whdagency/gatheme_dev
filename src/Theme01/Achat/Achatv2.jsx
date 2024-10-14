import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { incrementQuantity, decrementQuantity, removeItem, removeAll, addItem } from '../../lib/cartSlice';
import { APIURL, APIURLS3 } from '../../lib/ApiKey';
// import StepsBar from './Steps'
import StepsBar from './stepsv2'
import { Avatar,  AvatarImage, AvatarFallback} from "@/components/ui/avatar"
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
import loaderAnimation from "@/components/loader.json";
import Lottie from "lottie-react";
import Logo from '@/Theme01/MenuItems/waiter-svgrepo-com.svg';
import { MinusIcon, PlusIcon, TrashIcon } from '../../constant/page';
import { CartItemSuggestion } from '../../components/CartItemSuggestion';
import { CartItem } from '../../components/Variants&Itmes';
import FeedBack from '../../components/FeedBack';
export default function Achat({ resto_id, infoRes, customization, slug, selectedDishes }) {
  const cartItems = useSelector(state => state.cart.items);
  const isDishInCart = (dishId) => {
    return cartItems.some(item => item.id === dishId);
  };
   
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  const { tableName,
    submitBille, callWaiter, subscriptionPlan } = useMenu();
    const totalCost = filteredCartItems.reduce((total, item) => {
      // Convert item.price to a number, defaulting to 0 if it's not a valid number
      const itemPrice = parseFloat(item.current_price) || 0;
    
      // Initialize selectedPrices to 0 by default
      let selectedPrices = 0;
    
      // Check if item.selectedPrices is defined and process accordingly
      if (Array.isArray(item.selectedPrices)) {
        // Sum up all prices if it's an array
        selectedPrices = item.selectedPrices.reduce((sum, price) => {
          const parsedPrice = parseFloat(price);
          return sum + (isNaN(parsedPrice) ? 0 : parsedPrice);
        }, 0);
      } else if (typeof item.selectedPrices === 'string') {
        // Convert it to a number if it's a string
        selectedPrices = parseFloat(item.selectedPrices) || 0;
      } else if (typeof item.selectedPrices === 'number') {
        // Directly assign the number if it's already a number
        selectedPrices = item.selectedPrices;
      } else if (item.selectedPrices !== undefined) {
        // Handle other cases, like objects, null, etc.
        console.warn('Unexpected value for selectedPrices:', item.selectedPrices);
      }
    
      // Calculate the total cost for this item, defaulting item.quantity to 1 if not defined
      const itemTotal = (itemPrice + selectedPrices) * (item.quantity || 1);
    
      // Log the calculated total for debugging
      console.log("Item price:", itemPrice);
      console.log("Selected Prices:", selectedPrices);
      console.log("Item quantity:", item.quantity || 1);
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
  const [isLoading, setIsLoading] = useState(false);
  const {  google_buss } = infoRes;
  const hasTrustpilot = google_buss !== null && google_buss !== "";

  async function submitOrder(cartItems, totalCost) {

    if (!subscriptionPlan?.canOrderFeatures) return;
    setIsLoading(true);
    setIsModalOpen(false)
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
    try {
      const response = await fetch(`${APIURL}/api/order`, {
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
        const responseNotification = await fetch(`${APIURL}/api/notifications`, {
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
        setIsLoading(false);
      }

    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
    // setOrderSubmitted(true);
  }

  const [t, i18n] = useTranslation("global")
  const [activeIndex, setActiveIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFeedOpen, setIsModalFeedOpen] = useState(false);

  const fetchValues = async () => {
    try {
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
          setIsModalFeedOpen(true)
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

  const formattedTotalCost = new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
}).format(totalCost);


const formattedTotalCostWithSpaces = formattedTotalCost.replace(/,/g, ' ');

  const filtredSuggest = selectedDishes.filter(suggestedDish => 
    !filteredCartItems.some(cartItem => cartItem.id === suggestedDish.id)
  );  
  
  useEffect(() => {
       if(filtredSuggest.length == 0)
       {
        setIsModalOpen(false)
       }
  }, [filtredSuggest])
  // console.log("The Filtred Suggesttion => ", filtredSuggest);
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
              cartItems={filteredCartItems}
              totalCost={formattedTotalCostWithSpaces}
              canceled={canceled}
            />
          }
        </div>



        {isLoading ?
          <div className="flex items-center justify-center">
            <Lottie animationData={loaderAnimation} loop={true} style={{ width: 400, height: 400 }} />
          </div>
          :
          <div className="flex flex-col gap-4  snap-y  scrollbar-hide">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50" >{t("achat.shoppingCart")}<span className="text-xs text-muted-foreground capitalize font-normal"> {t("achat.ofTable")}: {tableName}</span></h2>
              <button onClick={() => { sessionStorage.setItem('modalOpened', ''); dispatch(removeAll()) }} className="text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {t("achat.clearBtn")}
              </button>
            </div>
            {filteredCartItems.length === 0 ? (
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
                    <span className="font-medium text-gray-900 dark:text-gray-50"> {formattedTotalCostWithSpaces + " " + infoRes.currency}</span>
                  </p>
                  <Button 
                     onClick={() => {
                      if (!subscriptionPlan?.canOrderFeatures) return;

                      setOrderSuccessModalOpen(!orderSuccessModalOpen);
                    }}
                    style={{ backgroundColor: customization?.selectedPrimaryColor }} 
                    className={`px-4 py-2 rounded-lg ${
                      !subscriptionPlan?.canOrderFeatures
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                    size="lg" 
                    disabled={!subscriptionPlan?.canOrderFeatures}
                  >
                    {t("achat.checkoutBtn")}
                  </Button>
                </div></div>



            ) : (
              <>
                {filteredCartItems.map(item => (
                  <CartItem key={item.id} item={item} infoRes={infoRes} />
                ))}
                <div className="flex justify-between items-center mb-12">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("achat.total")}:
                    <span className="font-medium text-gray-900 dark:text-gray-50"> {formattedTotalCostWithSpaces + " " + infoRes.currency}</span>
                  </p>
                  <Button onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)} style={{ backgroundColor: customization?.selectedPrimaryColor }} className="py-2 px-4 rounded-lg" size="lg">
                    {t("achat.checkoutBtn")}
                  </Button>
                </div>
              </>
            )}
          </div>}

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
              <img src={orderSvg} alt="Order" />
              <AlertDialogTitle className="text-center">{t("achat.successOrder")}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row gap-4 justify-center">
              <AlertDialogAction style={{ backgroundColor: customization?.selectedPrimaryColor }} autoFocus onClick={() => submitOrder(filteredCartItems, totalCost)}>
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
          <div className="mt-10 md:mt-2 mb-1 text-center text-lg font-semibold text-black">
            Suggested Products
          </div>
          <div className="grid grid-cols-2 gap-0 p-2 mb-3 ">
            {filtredSuggest?.slice(0, 4).map((item, index) => (
              <CartItemSuggestion
                key={index}
                item={item}
                infoRes={infoRes}
                customization={customization}
                resto_id={resto_id}
                isDishInCart={isDishInCart}
              />
            ))}
          </div>
        </CredenzaContent>
      </Credenza>
      <FeedBack 
         isModalOpen={isModalFeedOpen}
         setIsModalOpen={setIsModalFeedOpen}
         slug={slug}
         table_id={table_id}
         hasTrustpilot={hasTrustpilot}
         trustpilot_link={google_buss}
        />
    </>
  );
}


