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
import bill from "../Footer/bill.svg";
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
  const [isBill, setisBill] = useState(false);

  const togglePopup = () => {
    // console.log("Avant : isOpen =", isOpen);  
    setIsOpen(prev => !prev);  
    // console.log("Après : isOpen =", !isOpen);  
  };

  const callserver = () => {
    setisCall(true);
    setIsOpen(false);
  }

  const demandebill = () => {
    setisBill(true);
    setIsOpen(false);
  }

  const closeCall = () => {
    setisCall(false);
    setisBill(false);
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
            to={`/menu/${slug}/Search?table_id=${table_id}`}
            icon={IoSearchOutline}
            label={t("Search")}
            active={location.pathname === `/menu/${slug}/Search`}
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
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 h-32 mt-2 z-50">
                    <div className="bg-opacity-30 rounded-lg p-4 w-52 h-36 flex flex-col items-center">
                      <div className="w-full mb-2 flex justify-center">


                        <button className="bg-[red] text-white rounded-full p-2 w-12 h-12"
                          onClick={demandebill}
                        >
                          <NavItem
                            icon={HiNewspaper}
                            label={t("")}
                            customization={customization}
                            isCount={true}
                            totalQuantity={totalQuantity}
                          />
                        </button>
                      </div>

                      <div className="flex justify-between w-full">
                      <button className="bg-[red] text-white rounded-full p-2 w-12 h-12"
                          onClick={callserver}
                        >
                          <NavItem
                            icon={LuPhoneCall}
                            label={t("")}
                            customization={customization}
                            isCount={true}
                            totalQuantity={totalQuantity}
                          />
                        </button>
                        <button className="bg-[red] text-white rounded-full p-2 w-12 h-12">
                          <NavItem
                            icon={MdOutlineStarPurple500}
                            label={t("")}
                            customization={customization}
                            isCount={true}
                            totalQuantity={totalQuantity}
                          />
                        </button>
                        
                      </div>
                    </div>
                  </div>
                )}

            
            {isCall && (
                        <Popup 
                            onClose={closeCall} 
                            imgSrc={call} 
                            title="Confirm Call Waiter" 
                            message="Are you sure you want to call a waiter? They will come to your table shortly." 
                            confirmText="Confirm" 
                          />

                      )}

                    {isBill && (
                        <Popup 
                        onClose={closeCall}
                        imgSrc={bill}
                        title="Request Bill"
                        message="Do you want to request the bill? The waiter will bring it to your table shortly."
                        confirmText="Confirm"
                        />
                      )}

          </div>

          <NavItem
            to={`/menu/${slug}/Cart?table_id=${table_id}`}
            icon={CiShoppingBasket}
            label={t("menu.cart")}
            active={location.pathname === `/menu/${slug}/Cart`}
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
