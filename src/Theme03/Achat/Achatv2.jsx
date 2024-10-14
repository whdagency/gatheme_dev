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
import confirmorder from "./confirmorder.svg";
// import {conf} from "./con.svg";
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
   
  // console.log("inforeess ===  ", infoRes);
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  const { tableName,
    submitBille, callWaiter } = useMenu();
    const totalCost = filteredCartItems.reduce((total, item) => {
      // Convert item.price to a number, defaulting to 0 if it's not a valid number
      const itemPrice = parseFloat(item.price) || 0;
    
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
      // console.log("Item price:", itemPrice);
      // console.log("Selected Prices:", selectedPrices);
      // console.log("Item quantity:", item.quantity || 1);
      // console.log("Item total:", itemTotal);
    
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
  const [orderSuccess, setorderSuccess] = useState(false);
  const {  google_buss } = infoRes;
  const hasTrustpilot = google_buss !== null && google_buss !== "";

  async function submitOrder(cartItems, totalCost) {
    
    setOrderSuccessModalOpen(false);
    setorderSuccess(true);
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
      // console.log('Order submitted:', responseData?.order?.id);
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

        console.log("Niceeeee => ", responseNotification);
        setOrderSuccessModalOpen(false);
        setIsModalOpen(false);
        setOrderID(id);
        dispatch(removeAll());
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
    // setOrderSubmitted(true);
  }
  
  console.log("Success orderiiiing here: " , orderSuccess);
 
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
      // console.log("The Response of RestoInfo => ", resto_id);
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
      <div className={`bg-white snap-y scrollbar-hide overflow-y-auto dark:bg-gray-950 p-2 pt-4 rounded-lg shadow-lg max-w-[620px] mx-auto ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
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
          <div className='w-full h-[80px]  flex justify-center items-center'>
              <h1>My Cart</h1>
          </div>
        </div>



        {isLoading ?
          <div className="flex items-center justify-center ">
            <Lottie animationData={loaderAnimation} loop={true} style={{ width: 400, height: 400 }} />
          </div>
          :
          <div className="flex flex-col gap-4  snap-y  scrollbar-hide overflow-auto mb-[100px]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50" >Table : <span className="text-xs text-black capitalize font-normal">{tableName}</span></h2>
              <button
                  onClick={() => {
                    if (filteredCartItems.length > 0) {
                      sessionStorage.setItem('modalOpened', '');
                      dispatch(removeAll());
                    }
                  }}
                  className={`relative ${
                    filteredCartItems.length === 0
                      ? 'text-[#FFB3A4] cursor-not-allowed'
                      : 'text-[red] cursor-pointer'
                  }`}
                  disabled={filteredCartItems.length === 0}
                >
                  <span className="relative">
                    {t("achat.clearBtn")}
                    <span
                      className={`absolute left-0 bottom-[-2px] h-[2px] w-full ${
                        filteredCartItems.length === 0 ? 'bg-[#FFB3A4]' : 'bg-[red]'
                      }`}
                    />
                  </span>
                </button>

            </div>
            {filteredCartItems.length === 0 ? (
              <div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-64 h-44 flex-shrink-0 relative flex flex-col items-center justify-center">
                      <svg width="261" height="260" viewBox="0 0 261 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1936_9138)">
                      <path d="M130.499 229.222C185.509 229.222 230.104 184.799 230.104 129.999C230.104 75.1999 185.509 30.7762 130.499 30.7762C75.489 30.7762 30.8945 75.1999 30.8945 129.999C30.8945 184.799 75.489 229.222 130.499 229.222Z" fill="#E0E9F9"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M178.068 147.072L188.288 147.761L176.691 196.069L166.472 195.38L178.068 147.072Z" fill="#3594DC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M178.062 147.066C178.062 147.066 191.06 92.9295 195.467 74.5423C196.293 71.0616 199.548 68.6902 203.117 68.9309L219.246 70.0182C220.096 70.0755 220.863 70.5054 221.367 71.1824C221.871 71.8593 222.04 72.7217 221.851 73.5411C221.558 74.7695 221.216 76.1647 220.95 77.2815C220.629 78.6404 219.351 79.5754 217.954 79.4812C213.591 79.1871 204.885 78.6002 204.885 78.6002L188.278 147.774L178.061 147.085L178.062 147.066Z" fill="#3594DC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M94.7256 182.203L178.678 187.868L176.711 196.067L92.7591 190.401L94.7256 182.203Z" fill="#3594DC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M202.729 87.6554L69.457 78.6713C69.457 78.6713 74.5307 130.042 76.6557 151.398C77.1844 156.692 81.446 160.825 86.7651 161.184C106.837 162.537 154.276 165.735 174.348 167.088C179.667 167.447 184.475 163.924 185.697 158.749C190.709 137.874 202.729 87.6554 202.729 87.6554Z" fill="#4FB4F3"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M107.92 103.672L111.872 141.324C112.15 143.915 114.469 145.792 117.067 145.513C119.666 145.235 121.551 142.922 121.291 140.333L117.339 102.699C117.06 100.109 114.742 98.2316 112.144 98.4914C109.546 98.7512 107.661 101.082 107.92 103.672Z" fill="#1D77C7"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M108.289 107.157L111.872 141.324C112.15 143.915 114.469 145.792 117.068 145.514C119.667 145.235 121.551 142.922 121.292 140.333L117.709 106.166C117.431 103.575 115.112 101.698 112.514 101.958C109.915 102.237 108.03 104.568 108.289 107.157Z" fill="#3594DC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M152.007 105.026L142.988 141.785C142.359 144.314 143.929 146.879 146.468 147.485C149.005 148.11 151.578 146.543 152.186 144.031L161.207 107.254C161.835 104.724 160.264 102.179 157.727 101.554C155.188 100.948 152.635 102.496 152.007 105.026Z" fill="#1D77C7"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M151.162 108.505L142.986 141.804C142.358 144.333 143.928 146.897 146.466 147.503C149.003 148.128 151.577 146.562 152.185 144.05L160.361 110.751C160.989 108.222 159.419 105.658 156.881 105.052C154.343 104.427 151.771 105.974 151.162 108.505Z" fill="#3594DC"/>
                      <path d="M185.62 193.557C186.779 185.108 180.845 177.326 172.368 176.175C163.89 175.025 156.078 180.942 154.919 189.391C153.761 197.84 159.694 205.622 168.172 206.772C176.649 207.923 184.461 202.006 185.62 193.557Z" fill="#4FB4F3"/>
                      <path d="M175.091 192.133C175.454 189.481 173.592 187.038 170.931 186.677C168.269 186.316 165.817 188.173 165.454 190.826C165.09 193.478 166.952 195.921 169.613 196.282C172.275 196.643 174.727 194.786 175.091 192.133Z" fill="white"/>
                      <path d="M109.606 188.413C110.767 179.962 104.836 172.18 96.3599 171.031C87.8839 169.883 80.0721 175.802 78.9116 184.253C77.7512 192.704 83.6817 200.486 92.1577 201.635C100.634 202.783 108.446 196.864 109.606 188.413Z" fill="#4FB4F3"/>
                      <path d="M99.0779 186.992C99.4422 184.339 97.5805 181.896 94.9199 181.535C92.2592 181.175 89.807 183.033 89.4427 185.686C89.0785 188.339 90.9401 190.781 93.6008 191.142C96.2615 191.502 98.7136 189.644 99.0779 186.992Z" fill="white"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M102.999 80.847C101.829 98.0129 89.0359 111.651 72.7927 114.636L69.2158 78.5615L102.999 80.847Z" fill="#3594DC"/>
                      <path d="M64.5722 106.899C81.0047 106.899 94.326 93.6286 94.326 77.259C94.326 60.8893 81.0047 47.6191 64.5722 47.6191C48.1396 47.6191 34.8184 60.8893 34.8184 77.259C34.8184 93.6286 48.1396 106.899 64.5722 106.899Z" fill="#DB281C"/>
                      <path d="M71.8959 79.5998C71.8959 76.4751 71.4186 74.0975 70.5321 72.3993C69.6457 70.7011 68.3501 69.818 66.6454 69.818C65.0088 69.818 63.7133 70.6332 62.8269 72.3993C61.9404 74.0975 61.5312 76.4751 61.5312 79.5998C61.5312 82.7245 61.9404 85.1019 62.8269 86.8681C63.7133 88.5663 64.9406 89.4494 66.6454 89.4494C68.2819 89.4494 69.5775 88.5663 70.5321 86.8681C71.4186 85.1019 71.8959 82.7245 71.8959 79.5998ZM80.9652 79.5998C80.9652 82.3169 80.6243 84.7623 79.8742 86.8681C79.1923 88.9738 78.1695 90.7399 76.942 92.2343C75.6464 93.6608 74.1462 94.7477 72.4415 95.4949C70.6685 96.2421 68.7593 96.5818 66.7136 96.5818C64.5997 96.5818 62.6904 96.2421 60.9175 95.4949C59.1446 94.7477 57.6444 93.6608 56.4169 92.2343C55.1895 90.8078 54.1667 89.0418 53.4848 86.8681C52.8029 84.7623 52.4619 82.3169 52.4619 79.5998C52.4619 76.8827 52.8029 74.4373 53.4848 72.3315C54.1667 70.2257 55.1895 68.4595 56.4169 67.0331C57.7125 65.6066 59.2128 64.5197 60.9175 63.7725C62.6904 63.0253 64.5997 62.6855 66.7136 62.6855C68.7593 62.6855 70.6685 63.0932 72.4415 63.7725C74.2144 64.5197 75.7146 65.6066 76.942 67.0331C78.1695 68.4595 79.1923 70.2257 79.8742 72.3315C80.6243 74.4373 80.9652 76.8827 80.9652 79.5998Z" fill="#ED3F07"/>
                      <path d="M70.1108 76.5026C70.1108 73.3779 69.6334 71.0004 68.747 69.3022C67.8605 67.6039 66.5649 66.7208 64.8602 66.7208C63.2237 66.7208 61.9282 67.536 61.0417 69.3022C60.1552 71.0004 59.746 73.3779 59.746 76.5026C59.746 79.6273 60.1552 82.0048 61.0417 83.7709C61.9282 85.4691 63.1555 86.3522 64.8602 86.3522C66.4968 86.3522 67.7923 85.4691 68.747 83.7709C69.6334 82.0048 70.1108 79.6273 70.1108 76.5026ZM79.18 76.5026C79.18 79.2197 78.8392 81.6651 78.0891 83.7709C77.4072 85.8767 76.3843 87.6427 75.1569 89.1372C73.8613 90.5637 72.3611 91.6505 70.6563 92.3978C68.8834 93.145 66.9741 93.4847 64.9285 93.4847C62.8146 93.4847 60.9053 93.145 59.1324 92.3978C57.3594 91.6505 55.8592 90.5637 54.6318 89.1372C53.4044 87.7107 52.3815 85.9446 51.6996 83.7709C51.0177 81.6651 50.6768 79.2197 50.6768 76.5026C50.6768 73.7855 51.0177 71.3401 51.6996 69.2343C52.3815 67.1285 53.4044 65.3624 54.6318 63.9359C55.9274 62.5094 57.4276 61.4225 59.1324 60.6753C60.9053 59.9281 62.8146 59.5884 64.9285 59.5884C66.9741 59.5884 68.8834 59.996 70.6563 60.6753C72.4292 61.4225 73.9295 62.5094 75.1569 63.9359C76.3843 65.3624 77.4072 67.1285 78.0891 69.2343C78.8392 71.3401 79.18 73.7855 79.18 76.5026Z" fill="white"/>
                      <path d="M23.6734 61.2409C23.585 61.2409 23.4789 61.2233 23.3905 61.2057L6.11596 57.0313C5.46175 56.8728 5.05506 56.2211 5.2142 55.5694C5.37333 54.9177 6.02754 54.5126 6.68175 54.6711L23.9563 58.8455C24.6105 59.004 25.0172 59.6557 24.8581 60.3074C24.7166 60.871 24.2215 61.2409 23.6734 61.2409Z" fill="#DB281C"/>
                      <path d="M42.9474 41.525C42.4523 41.525 41.9926 41.2256 41.8158 40.75L36.5645 27.0995C36.317 26.4655 36.6352 25.7785 37.2717 25.5319C37.9083 25.2854 38.5978 25.6024 38.8454 26.2365L44.0967 39.8869C44.3442 40.521 44.0259 41.2079 43.3894 41.4545C43.248 41.4898 43.0888 41.525 42.9474 41.525Z" fill="#DB281C"/>
                      <path d="M29.57 49.686C29.2518 49.686 28.9512 49.5627 28.7036 49.3337L12.3131 33.006C11.8357 32.5304 11.8357 31.7554 12.3131 31.2975C12.7905 30.8219 13.5685 30.8219 14.0282 31.2975L30.4187 47.6252C30.8961 48.1007 30.8961 48.8757 30.4187 49.3337C30.1889 49.5627 29.8883 49.686 29.57 49.686Z" fill="#DB281C"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_1936_9138">
                      <rect width="261" height="260" fill="white"/>
                      </clipPath>
                      </defs>
                      </svg>
                  </div>
                  <div className='font-semibold text-center mt-2 '>
                    <p className='text-xl'>{t("achat.emptycart")}</p>
                    <p className="text-gray-500 text-center mt-2 text-base dark:text-gray-400">
                    Looks like you haven't made your choice yet...
                    </p>
                    <Link to={`/menu/${slug}?table_id=${table_id}`}>
                      <p className=" text-center mt-2 text-lg dark:text-red-400 " style={{ color: 'red' }}>
                        <FaPlus size={15} className="inline-block mr-1" />  {t("achat.addmoreitems")}
                      </p>
                    </Link>

                  </div>

                </div>
                <div className="flex flex-col justify-between  mt-16 ">
                  <div className='flex justify-between items-center'>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("achat.total")}:
                      </p>
                      <span className="font-medium text-gray-900 dark:text-gray-50"> {formattedTotalCostWithSpaces + " " + infoRes.currency}</span>
                  </div>
                  <Button onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)} style={{ backgroundColor: '#FFBBB6' }} className="py-2 px-4 rounded-lg my-4" size="lg" disabled>
                    {t("achat.checkoutBtn")}
                  </Button>
                </div>
                </div>



            ) : (
              <>
                  <div className='mb-[100px]'>
                    {filteredCartItems.map(item => (

                        <CartItem key={item.id} item={item} infoRes={infoRes} />
                    ))}
                  
                  </div>

                  <div className="fixed bottom-[50px] left-0 right-0 bg-white p-4  z-45">
                    <div className="flex flex-col justify-between mx-auto">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {t("achat.total")}:
                        </p>
                        <span className="font-medium text-gray-900 dark:text-gray-50">
                          {formattedTotalCostWithSpaces + " " + infoRes.currency}
                        </span>
                      </div>
                      <Button
                        onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)}
                        className="py-2 px-4 rounded-lg my-4 bg-[red]"
                        size="lg"
                      >
                        {t("achat.checkoutBtn")}
                      </Button>
                    </div>
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
              <img src={confirmorder} alt="Order" />
              <h1>Confirm Order</h1>
              <p className="text-center text-gray-500">Are you ready to place your order? Your selected items will be submitted.</p>
            </AlertDialogHeader>
            <div className="flex  gap-4 justify-center items-center">
              <button className='text-[red] border-2 border-[#DB281C] rounded-md bg-[white] px-4 py-2' autoFocus onClick={() => setOrderSuccessModalOpen(false)}>
                {t("menu.cancel")}
              </button>
              <button className='text-[white] border-2 border-[#DB281C] rounded-md bg-[#DB281C] px-4 py-2' autoFocus  onClick={() => submitOrder(filteredCartItems, totalCost)} variant="outline" >
                {t("menu.ok")}
              </button>

            </div>
          </AlertDialogContent>
        </AlertDialog>

        {orderSuccess && (
         
          
         <AlertDialog
         open={orderSuccess}
         onOpenChange={setorderSuccess}
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
               onClick={() => setorderSuccess(false)} // Close the dialog
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
             <img src={confirmorder} alt="Order" />
             <h1>Order Confirmed!</h1>
             <p className="text-center text-gray-500">Your order has been placed. Enjoy your meal!</p>
           </AlertDialogHeader>
           <div className="flex  gap-4 justify-center items-center">
     
             <button className='text-[white] border-2 border-[#DB281C] rounded-md bg-[#DB281C] px-4 py-2' autoFocus onClick={() => setorderSuccess(false)}  variant="outline" >
               {t("menu.ok")}
             </button>

           </div>
         </AlertDialogContent>
       </AlertDialog>
         

         
        
        
        )}


                

      </div>
      {/* <Credenza className="!bg-white  !py-0" open={isModalOpen} onOpenChange={setIsModalOpen}>
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
      </Credenza> */}
      {/* <FeedBack 
         isModalOpen={isModalFeedOpen}
         setIsModalOpen={setIsModalFeedOpen}
         slug={slug}
         table_id={table_id}
         hasTrustpilot={hasTrustpilot}
         trustpilot_link={google_buss}
        /> */}
    </>
  );
}


