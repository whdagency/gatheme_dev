// File: Footer.js

import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { TbMessage2Question } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function Footer({ slug, customization }) {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);

  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const table_id = extraInfo;
  const [t, i18n] = useTranslation("global");
  const isRTL = i18n.language === 'ar';

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <footer className={`fixed shadow-inner bottom-0 left-0 right-0 z-50 rounded-t-xl h-14 flex w-full items-center justify-around mx-auto dark:bg-gray-900 md:max-w-[50%] lg:max-w-[40%] xl:max-w-[30%] ${isRTL ? 'flex-row-reverse' : ''}`} style={{ backgroundColor: customization?.selectedBgColor }}>

        <NavItem
          to={`/menu/${slug}?table_id=${table_id}`}
          icon={FiHome}
          label={t("menu.home")}
          active={location.pathname === `/menu/${slug}`}
          customization={customization}
        />
        <NavItem
          to={`/menu/${slug}/Rating?table_id=${table_id}`}
          icon={FaRegStar}
          label={t("menu.rating")}
          active={location.pathname === `/menu/${slug}/Rating`}
          customization={customization}
        />
        <NavItem
          to={`/menu/${slug}/Claims?table_id=${table_id}`}
          icon={TbMessage2Question}
          label={t("menu.claims")}
          active={location.pathname === `/menu/${slug}/Claims`}
          customization={customization}
        />
        <NavItem
          to={`/menu/${slug}/Achat?table_id=${table_id}`}
          icon={FiShoppingBag}
          label={t("menu.cart")}
          active={location.pathname === `/menu/${slug}/Achat`}
          customization={customization}
          isCount={true}
          totalQuantity={totalQuantity}
        />
        <NavItem
          to={`/menu/${slug}/info?table_id=${table_id}`}
          icon={IoInformationCircleOutline}
          label={t("menu.info")}
          active={location.pathname === `/menu/${slug}/info`}
          customization={customization}
        />

      </footer>

    </>
  );
}

function NavItem({ to, icon: Icon, label, active, customization, isCount = false, totalQuantity }) {
  return (
    <>
      <Link to={to} style={{ color: active ? customization?.selectedPrimaryColor : customization?.selectedSecondaryColor }} className={`flex flex-col relative items-center justify-center gap-1 `}>
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">{label}</span>
        {
          isCount && totalQuantity > 0 &&
          (
            <div className='absolute -right-2.5 top-0 bg-red-600 size-4 grid place-content-center rounded-full text-white text-[10px] leading-3'>
              {totalQuantity}
            </div>
          )
        }
      </Link>

    </>
  );
}
