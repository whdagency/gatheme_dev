import React, { useEffect, useState } from "react";
import { APIURL, APIURLS3 } from "../../lib/ApiKey";
import { useMenu } from "../../hooks/useMenu";
import { Link, useLocation } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { MapPin, Phone, PhoneCall } from "lucide-react";
import { axiosInstance } from "../../axiosInstance";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const ThemeOneBanner = () => {
  const { restos, tableName, resInfo, customization } = useMenu();

    const DEFAULT_THEME = {
      id: 4,
      selectedBgColor: "#fff",
      selectedHeader: "logo-header",
      selectedLayout: "theme-grid",
      selectedPrimaryColor: "#000",
      selectedSecondaryColor: "#6B7280",
      selectedTheme: 1,
      selectedTextColor: "#fff",
      selectedIconColor: "#fff",
      isDefault: true,
    };
  const [t, i18n] = useTranslation("global");

  return (
    <div className="w-full  md:h-[40vh] h-[40vh] relative">
          <Avatar className="md:h-[40vh] h-[40vh] rounded-none w-full mb-2">
                <AvatarImage 
                src={`${APIURLS3}/${resInfo.cover_image}`}
                className="bg-white h-full w-full  object-cover"
                />
                <AvatarFallback className="bg-slate-500 md:h-[40vh] rounded-none h-[40vh] w-full"></AvatarFallback>
            </Avatar>
      {/* Overlay */}
      <div className="bg-gradient-to-t from-black absolute inset-0 z-10 h-full"></div>

      <h2 className="top-1/2 md:text-3xl absolute inset-x-0 z-20 flex items-center justify-center text-2xl font-bold text-center text-white uppercase">
        {restos.name}
      </h2>

      <div className="absolute  inset-x-0 bottom-0 items-center z-20 flex justify-between p-4 text-center">
        <div className="md:gap-5 mb-1 self-end flex items-center gap-3">
          {resInfo.facebook && (
            <Link to={resInfo.facebook} target="_blank">
              <FaFacebook size={20} color={customization?.isDefault == false ? customization.selectedIconColor : DEFAULT_THEME.selectedIconColor} />

            </Link>
          )}
          {resInfo.tiktok && (
            <Link to={resInfo.tiktok} target="_blank">
              <FaTiktok size={20} color={customization?.isDefault == false ? customization.selectedIconColor : DEFAULT_THEME.selectedIconColor} />
            </Link>
          )}
          {resInfo.youtube && (
            <Link to={resInfo.youtube} target="_blank">
              <FaYoutube size={20} color={customization?.isDefault == false ? customization.selectedIconColor : DEFAULT_THEME.selectedIconColor} />
            </Link>
          )}
          {resInfo.snapshat && (
            <Link to={resInfo.snapshat} target="_blank">
              <FaSnapchatGhost
                size={20}
                color={customization?.isDefault == false ? customization.selectedIconColor : DEFAULT_THEME.selectedIconColor}
              />
            </Link>
          )}
          {resInfo.instgram && (
            <Link to={resInfo.instgram} target="_blank">
              <FaInstagram size={20} color={customization?.isDefault == false ? customization.selectedIconColor : DEFAULT_THEME.selectedIconColor} />
            </Link>
          )}
        </div>

        <div className={`flex-col items-center md:gap-5 flex gap-3`}>
          <p className="text-white self-start ">{t("achat.table")}  : {tableName}</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeOneBanner;