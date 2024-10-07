import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { TbMessage2Question } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { CiShoppingBasket } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { RiHome5Fill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from "react-icons/io5";
import { BiDish } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import { HiNewspaper } from "react-icons/hi2";
import { MdOutlineStarPurple500 } from "react-icons/md";
import call from "../Footer/call2.svg";
import Popup from './Popup';





export default function Footer({ slug, customization, resto_id }) {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);

  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const table_id = extraInfo;
  const [t, i18n] = useTranslation("global");
  const isRTL = i18n.language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [isCall, setisCall] = useState(false);

  const togglePopup = () => {
    // console.log("Avant : isOpen =", isOpen);  
    setIsOpen(prev => !prev);  
    // console.log("Après : isOpen =", !isOpen);  
  };

  const callserver = () => {
    setisCall(true);
    setIsOpen(false);
  }

  const closeCall = () => {
    setisCall(false);
  }

  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  const totalQuantity = filteredCartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <footer className={`fixed shadow-inner bottom-0 left-0 right-0 z-50 rounded-t-xl h-14 dark:bg-gray-900 md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%] ${isRTL ? 'flex-row-reverse' : ''}`} style={{ backgroundColor: "#FFF8EB" }}>        
        <div className='lg:max-w-[50%] max-w-full w-full flex h-14 items-center justify-around mx-auto relative'>
          <NavItem
            to={`/menu/${slug}?table_id=${table_id}`}
            icon={RiHome5Fill}
            label={t("menu.home")}
            active={location.pathname === `/menu/${slug}`}
            customization={customization}
          />
          <NavItem
            // to={`/menu/${slug}/Rating?table_id=${table_id}`}
            icon={IoSearchOutline}
            label={t("Search")}
            // active={location.pathname === `/menu/${slug}/Rating`}
            customization={customization}
          />

          {/* Icone centrer */}
          <div className={`absolute -top-6 p-2 rounded-full border border-4 border-[#FFF8EB] ${isOpen ? 'bg-[white]' : 'bg-[red]'} shadow-md`}>
            <div onClick={togglePopup} style={{ cursor: 'pointer' }}>
              <NavItem
                icon={isOpen ? IoCloseSharp : BiDish} 
                label={t("")}
                customization={customization}
                isCentered={true}
              />
            </div>

            {isOpen && ( 
              <div className="absolute bottom-12   left-1/2 transform -translate-x-1/2 h-32 mt-2 z-50">
                <div className="bg-opacity-30 rounded-lg p-4 w-52 h-36 flex flex-col items-center">
                  <div className="flex justify-between w-full mb-2">
                    <button className="bg-[red] text-white rounded-full p-2 w-12 h-12"
                    onClick={callserver}
                    >
                    <NavItem
                        // to={`/menu/${slug}/Cart?table_id=${table_id}`}
                        icon={LuPhoneCall}
                        label={t("")}
                        // active={location.pathname === `/menu/${slug}/Cart`}
                        customization={customization}
                        isCount={true}
                        totalQuantity={totalQuantity}
                      />
                     
                    </button>
                    
                    <button className="bg-[red] text-white rounded-full p-2 w-12 h-12">
                    <NavItem
                        // to={`/menu/${slug}/Cart?table_id=${table_id}`}
                        icon={HiNewspaper}
                        label={t("")}
                        // active={location.pathname === `/menu/${slug}/Cart`}
                        customization={customization}
                        isCount={true}
                        totalQuantity={totalQuantity}
                      />
                    </button>
                  </div>
                  <button className="bg-[red] text-white rounded-full p-2 w-12 h-12">
                  <NavItem
                        // to={`/menu/${slug}/Cart?table_id=${table_id}`}
                        icon={MdOutlineStarPurple500}
                        label={t("")}
                        // active={location.pathname === `/menu/${slug}/Cart`}
                        customization={customization}
                        isCount={true}
                        totalQuantity={totalQuantity}
                      />
                  </button>
                </div>
              </div>
            )}
            {isCall && (
                        // <div className='absolute bottom-[330px]   left-1/2 transform -translate-x-1/2 h-32 mt-2 z-50 '>
                        //   <div className='w-[300px] h-[361px] bg-[white] opacity-2	 border rounded-lg flex flex-col justify-center items-center'>
                        //     <div className='w-full h-[50px]  flex justify-end '>
                        //       <button className='w-12 h-12 '
                        //       onClick={closeCall}
                        //       >
                        //       <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                        //           <path d="M16.4506 14.0589L21.4673 9.05385C21.6869 8.83416 21.8104 8.5362 21.8104 8.22552C21.8104 7.91483 21.6869 7.61687 21.4673 7.39718C21.2476 7.1775 20.9496 7.05408 20.6389 7.05408C20.3282 7.05408 20.0303 7.1775 19.8106 7.39718L14.8056 12.4139L9.80059 7.39718C9.58091 7.1775 9.28294 7.05408 8.97226 7.05408C8.66157 7.05408 8.36361 7.1775 8.14393 7.39718C7.92424 7.61687 7.80082 7.91483 7.80082 8.22552C7.80082 8.5362 7.92424 8.83416 8.14393 9.05385L13.1606 14.0589L8.14393 19.0639C8.03458 19.1723 7.94778 19.3013 7.88855 19.4435C7.82932 19.5857 7.79883 19.7382 7.79883 19.8922C7.79883 20.0462 7.82932 20.1987 7.88855 20.3409C7.94778 20.483 8.03458 20.6121 8.14393 20.7205C8.25238 20.8299 8.38142 20.9167 8.52359 20.9759C8.66576 21.0351 8.81825 21.0656 8.97226 21.0656C9.12627 21.0656 9.27876 21.0351 9.42093 20.9759C9.5631 20.9167 9.69214 20.8299 9.80059 20.7205L14.8056 15.7039L19.8106 20.7205C19.9191 20.8299 20.0481 20.9167 20.1903 20.9759C20.3324 21.0351 20.4849 21.0656 20.6389 21.0656C20.7929 21.0656 20.9454 21.0351 21.0876 20.9759C21.2298 20.9167 21.3588 20.8299 21.4673 20.7205C21.5766 20.6121 21.6634 20.483 21.7226 20.3409C21.7819 20.1987 21.8124 20.0462 21.8124 19.8922C21.8124 19.7382 21.7819 19.5857 21.7226 19.4435C21.6634 19.3013 21.5766 19.1723 21.4673 19.0639L16.4506 14.0589Z" fill="#ADADAD"/>
                        //         </svg>
                        //       </button>
                        //     </div>
                        //     <img src={call} alt="Waiter Icon" className="h-32 w-32" />
                        //     <h1 className='my-2 text-[#020817] text-center font-[Roboto] text-[22px] not-italic font-semibold leading-[31.843px]'>Confirm Call Waiter</h1>
                        //     <p className='mx-2 my-4 text-[#8D8D8D] text-center font-[Roboto] text-[14px] not-italic font-semibold leading-[22.745px]'>Are you sure you want to call a waiter? They will come to your table shortly.</p>
                        //     <button className='flex w-[255px] h-[39px] px-[100px] py-[10px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[10px] bg-[var(--Primary1,_#DB281C)] text-white'>Confirm</button>
                        //   </div>
                        // </div>

                        <Popup 
                            onClose={closeCall} 
                            imgSrc={call} 
                            title="Confirm Call Waiter" 
                            message="Are you sure you want to call a waiter? They will come to your table shortly." 
                            confirmText="Confirm" 
                          />

                      )}
          </div>

          <NavItem
            // to={`/menu/${slug}/Cart?table_id=${table_id}`}
            icon={CiShoppingBasket}
            label={t("menu.cart")}
            // active={location.pathname === `/menu/${slug}/Cart`}
            customization={customization}
            isCount={true}
            totalQuantity={totalQuantity}
          />
          <NavItem
            // to={`/menu/${slug}/info?table_id=${table_id}`}
            icon={IoInformationCircleOutline}
            label={t("menu.info")}
            // active={location.pathname === `/menu/${slug}/info`}
            customization={customization}
          />
        </div>
      </footer>
    </>
  );
}

function NavItem({ to, icon: Icon, label, active, customization, isCount = false, totalQuantity, isCentered = false }) {
  return (
    <>
      <Link 
        to={to} 
        style={{ color: active ? "red" : customization?.selectedSecondaryColor }} 
        className={`flex flex-col relative items-center justify-center gap-1 ${isCentered ? "scale-110" : ""}`}
      >
        <Icon className="h-6 w-6  "
        style={{ color: Icon === LuPhoneCall || Icon === BiDish || Icon === MdOutlineStarPurple500 || Icon === HiNewspaper ? 'white' : '' }} 
        />
        <span className="text-xs font-medium">{label}</span>
        {isCount && totalQuantity > 0 && (
          <div className='absolute -right-2.5 top-0 bg-red-600 size-4 grid place-content-center rounded-full text-white text-[10px] leading-3'>
            {totalQuantity}
          </div>
        )}
      </Link>
    </>
  );
}


