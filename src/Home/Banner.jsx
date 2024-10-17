import React from "react";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";

const Banner = () => {
  const { restos, resInfo } = useMenu();
  return (
    <div className="relative -mt-3">
      <div className="bg-black/50 absolute inset-0 flex items-center justify-center rounded-[20px_20px_40px_40px]" />
      <img
        src={`${STORAGE_URL}/${resInfo.cover_image}`}
        alt="Burger King Storefront"
        className="rounded-[20px_20px_40px_40px] object-cover w-full h-[223px]"
        onError={(e) => (e.target.src = "/assets/banner.png")}
      />

      <div className="left-10 bottom-4 absolute flex items-center transform translate-y-1/2">
        <img
          src={`${STORAGE_URL}/${resInfo?.logo}`}
          alt="Burger King Logo"
          className="w-[71px] object-cover h-[71px] rounded-[25px] border-[#E9E9E9] border-2"
          onError={(e) => (e.target.src = "/assets/logo-icon.png")}
        />
        <h1 className="ml-2 -mt-2 text-xl font-normal text-white">
          {restos?.name || "Restaurant Name"}
        </h1>
      </div>
    </div>
  );
};

export default Banner;
