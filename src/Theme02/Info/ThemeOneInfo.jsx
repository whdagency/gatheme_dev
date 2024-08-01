import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useMenu } from "../../hooks/useMenu";
import Spinner from "react-spinner-material";
import { APIURL } from "../../lib/ApiKey";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat, FaYoutube } from "react-icons/fa";

import { Check, CopyIcon, PhoneIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { DialogClose } from "../../components/ui/dialog";
import { useTranslation } from "react-i18next";

const ThemeOneInfo = ({ activeLink }) => {
  const { customization, resInfo, restos } = useMenu();
  const [passwordCopied, setPasswordCopied] = useState(false);
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  if (!resInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size={100}
          color={"#28509E"}
          spinnerWidth={1}
          visible={true}
          style={{ borderColor: "#28509E", borderWidth: 2 }}
        />
      </div>
    );
  }

  const socialMediaLinks = [
    { icon: FaFacebook, link: resInfo.facebook },
    { icon: FaInstagram, link: resInfo.instgram },
    { icon: FaTiktok, link: resInfo.tiktok },
    { icon: FaSnapchat, link: resInfo.snapshat },
    { icon: FaYoutube, link: resInfo.youtube },
  ].filter((item) => item.link); // Filter out

  return (
    <Dialog>
      <DialogTrigger>
        <IoInformationCircleOutline
          size={30}
          color={customization?.selectedPrimaryColor}
        />
      </DialogTrigger>

      <DialogContent id="hide" className="w-[22rem] rounded-md">
  <ScrollArea className="h-[80vh] w-full ">
    <div className="relative flex flex-col items-center w-full py-5">
      <DialogClose>
        <img
          src="/assets/close.svg"
          alt="close button"
          className="absolute top-0 right-0 w-8 h-8"
        />
      </DialogClose>

      <div className={`flex flex-col items-center w-[90%] gap-5`}>
        <img
          alt="Restaurant Logo"
          className="mb-4 rounded-full"
          height={110}
          src={`${APIURL}/storage/${resInfo.logo}`}
          style={{ aspectRatio: "80/80", objectFit: "cover" }}
          width={110}
        />

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold text-center capitalize">
            {restos.name}
          </h1>

          <p className="opacity-70 text-base font-normal text-center">
            {resInfo.description}
          </p>
        </div>

        <div className="flex flex-col items-start w-full gap-2">
          <h3 className="text-lg font-bold text-black">{t('info.FollowUs')}</h3>
          <div className="flex flex-wrap items-center gap-3 py-2">
            {socialMediaLinks.map((item, index) => (
              <div key={index} className="w-10 h-10 rounded-full border border-1 border-grey/50 grid text-[#28509E] place-content-center mx-2 mb-2">
                <Link to={item.link} target="_blank">
                  <item.icon
                    size={20}
                    color={customization?.selectedIconColor} style={{mixBlendMode:'difference'}}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          {resInfo.phone && (
            <p className="flex items-center gap-4">
              <span className="text-sm font-bold text-black">{t('info.phone')}</span>
              <span className="text-sm font-normal text-gray-700">
                {resInfo.phone}
              </span>
            </p>
          )}

          {resInfo.address && (
            <p className="flex items-center gap-4">
              <span className="text-sm font-bold text-black">{t('info.Address')}</span>
              <span className="text-sm font-normal text-gray-700">
                {resInfo.address}
              </span>
            </p>
          )} 
        </div>

        <div className="w-full p-4 mb-6 bg-gray-100 rounded-lg">
          <h2 className="mb-2 text-[14.85px] font-[Inter] font-bold">
          {t('info.WiFiPassword')}
          </h2>
          <div className="flex items-center justify-between">
            <span className="font-medium font-[Inter] text-[13.53px] text-gray-700">
              {resInfo.wifi_pass}
            </span>

            <div className="flex space-x-2">
              <Button
                className="rounded-full"
                size="icon"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(resInfo.wifi_pass);
                  setPasswordCopied(true);
                  setTimeout(() => {
                    setPasswordCopied(false);
                  }, 1000);
                }}
              >
                {passwordCopied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <CopyIcon className="w-5 h-5" />
                )}
                <span className="sr-only">Copy WiFi Password</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>
</DialogContent>

    </Dialog>
  );
};

export default ThemeOneInfo;