import React, { useEffect, useState } from "react";
import { APIURL } from "../../lib/ApiKey";
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

const ThemeOneBanner = () => {
  const { restos, tableName, resInfo, customization } = useMenu();

  const addressAvailable =
    resInfo.address && resInfo.address !== "" ? true : false;


  return (
    <div className="w-full  md:h-[40vh] h-[40vh] relative">
      {/* Cover Image */}
      <img
        src={`${APIURL}/storage/${resInfo.cover_image}`}
        alt={restos.name}
        loading="lazy"
        className="object-cover w-full h-full"
        onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
      />

      {/* Overlay */}
      <div className="bg-gradient-to-t from-black absolute inset-0 z-10 h-full"></div>

      <h2 className="top-1/2 md:text-3xl absolute inset-x-0 z-20 flex items-center justify-center text-2xl font-bold text-center text-white uppercase">
        {restos.name}
      </h2>

      <div className="absolute  inset-x-0 bottom-0 items-center z-20 flex justify-between p-4 text-center">
        {/* Social Icons */}
        <div className="md:gap-5 mb-1 self-end flex items-center gap-3">
          {resInfo.facebook && (
            <Link to={resInfo.facebook} target="_blank">
              <FaFacebook size={20} color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.tiktok && (
            <Link to={resInfo.tiktok} target="_blank">
              <FaTiktok size={20} color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.youtube && (
            <Link to={resInfo.youtube} target="_blank">
              <FaYoutube size={20} color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.snapshat && (
            <Link to={resInfo.snapshat} target="_blank">
              <FaSnapchatGhost
                size={20}
                color={customization.selectedIconColor}
              />
            </Link>
          )}
          {resInfo.instgram && (
            <Link to={resInfo.instgram} target="_blank">
              <FaInstagram size={20} color={customization.selectedIconColor} />
            </Link>
          )}
        </div>

        {/* About Restaurant  */}
        <div className={`flex-col items-center md:gap-5 flex gap-3`}>
          <p className="text-white self-start ">Table : {tableName}</p>
          {resInfo.phone && (
            <p
              style={{ backgroundColor: customization.selectedPrimaryColor }}
              className="md:text-sm flex items-center gap-2 p-2 text-xs text-white rounded-sm"
            >
              <PhoneCall
                size={18}
                style={{ color: customization.selectedIconColor }}
              />
              <span style={{ color: customization.selectedIconColor }}>
                0507994477
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeOneBanner;