import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWifi,
  FaInstagram,
  FaFacebook,
  FaSnapchat,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";
import { TelephoneIcon, Timer } from "../components/icons";

const Info = () => {
  const { restos, resInfo } = useMenu();
  const wifiPassword = resInfo?.wifi_pass || "N/A";
  const restoName = restos?.name || "Restaurant Name";
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard
      .writeText(wifiPassword)
      .then(() => {
        toast.success("Copied to clipboard");
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.log({ err });
        setCopied(false);
        toast.error("Could not copy password");
      });
  };

  const socialMediaLinks = [
    {
      icon: FaFacebook,
      link: resInfo.facebook,
      name: "Facebook",
    },
    {
      icon: FaInstagram,
      link: resInfo.instgram,
      name: "Instagram",
    },
    {
      icon: FaTiktok,
      link: resInfo.tiktok,
      name: "TikTok",
    },
    {
      icon: FaSnapchat,
      link: resInfo.snapshat,
      name: "Snapchat",
    },
    {
      icon: FaYoutube,
      link: resInfo.youtube,
      name: "Youtube",
    },
  ]
    .filter((item) => item.link)
    .map((item) =>
      item.link.includes("https")
        ? { ...item, link: item.link }
        : { ...item, link: `https://www.${item.link}` }
    );

  console.log({ socialMediaLinks });

  return (
    <div className="pb-28">
      <div className="relative -mt-3">
        <div className="bg-black/30 absolute inset-0 flex items-center justify-center rounded-[20px_20px_24px_24px]" />
        <img
          // src="/assets/banner.png"
          src={`${STORAGE_URL}/${resInfo.cover_image}`}
          alt={restos?.description || "Restaurant Banner"}
          className="rounded-[20px_20px_24px_24px] object-cover w-full h-[223px]"
          onError={(e) => (e.target.src = "/assets/banner.png")}
        />
      </div>

      {/* Info Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 capitalize">
          {restoName}
        </h2>

        <p className="mt-2 text-sm text-[#919191]">
          {resInfo?.address || "N/A"}
        </p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center space-x-2">
            <TelephoneIcon />
            <span className="text-[#181C2E] text-sm font-medium">
              {resInfo?.phone?.includes("+")
                ? resInfo?.phone.replace(/(\d{3})(?=\d)/g, "$1 ")
                : `+${resInfo?.phone.replace(/(\d{3})(?=\d)/g, "$1 ")}` ||
                  "N/A"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Timer />
            <span className="text-[#181C2E] text-sm font-medium">
              10AM – 11PM
            </span>
          </div>
        </div>

        <p className="mt-4 text-[#A0A5BA] pb-4 pt-2">
          {resInfo?.description || "N/A"}
        </p>

        <div className="p-6 mt-4 bg-[#FFF6E9] rounded-lg">
          <div className="flex items-center gap-3">
            <FaWifi className="text-black" size={30} />
            <span className="font-semibold text-black text-[17.458px]">
              WiFi Password
            </span>
          </div>

          <p
            onClick={handleCopyPassword}
            className="flex items-center justify-between gap-3 mt-5 cursor-pointer"
          >
            <span className="text-base font-medium text-black">
              {wifiPassword}
            </span>
            <span>
              {copied ? (
                <IoCheckmarkOutline size={20} color={"black"} />
              ) : (
                <IoCopyOutline size={20} color={"black"} />
              )}
            </span>
          </p>
        </div>

        {/* Social Icons */}
        {socialMediaLinks.length > 0 && (
          <div className={`flex flex-col gap-4 mt-7`}>
            <h4 className="text-lg font-semibold text-black">{"Follow Us"}:</h4>

            <div className="flex flex-wrap items-center justify-start gap-4">
              {socialMediaLinks.map(({ link, name, ...rest }, index) => (
                <Link
                  to={link}
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#FFF6E9",
                    boxShadow: "0px 4px 4.1px 0px rgba(0, 0, 0, 0.10)",
                    borderRadius: "14.739px",
                    padding: "13.704px 13.446px",
                  }}
                  className="flex items-center justify-center"
                >
                  <rest.icon size={30} color={"#F86A2F"} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
