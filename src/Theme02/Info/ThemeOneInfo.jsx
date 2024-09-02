import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useMenu } from "../../hooks/useMenu";
import Spinner from "react-spinner-material";
import { APIURL, APIURLS3 } from "../../lib/ApiKey";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat, FaYoutube } from "react-icons/fa";

import { FaChevronRight } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import { Check, CopyIcon, ChevronRight, PhoneIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
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

  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(resInfo.language);
  const socialMediaLinks = [
    { icon: FaFacebook, link: resInfo.facebook },
    { icon: FaInstagram, link: resInfo.instgram },
    { icon: FaTiktok, link: resInfo.tiktok },
    { icon: FaSnapchat, link: resInfo.snapshat },
    { icon: FaYoutube, link: resInfo.youtube },
  ].filter((item) => item.link); // Filter out
  const languageMap = {
    en: "English",
    fr: "French",
    es: "Spanish",
    it: "Italian",
    ar: "العربية"
  };
  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setSelectedLanguageCode(languageCode);
    setIsOpen(false)
  };
  return (
    <Dialog>
      <DialogTrigger>
        <IoInformationCircleOutline
          size={30}
          color={customization?.selectedPrimaryColor}
        />
      </DialogTrigger>

      <DialogContent id="hide" className="w-[87%] !py-0 p-4 rounded-md">
        <ScrollArea className="h-[75vh] !p-0 w-full ">
          <DialogClose>
            <img
              src="/assets/close.svg"
              alt="close button"
              className="absolute z-30 top-3 right-0 w-8 h-8"
            />
          </DialogClose>
          <div className="relative p-0 flex flex-col items-center w-full py-0">


            <div className={`flex flex-col items-center w-[90%] gap-5`}>
              <img
                alt="Restaurant Logo"
                className="rounded-full"
                height={110}
                // src={`${APIURL}/storage/${resInfo.logo}`}
                src={`${APIURLS3}/${resInfo.logo}`}
                style={{ aspectRatio: "80/80", objectFit: "cover" }}
                width={110}
              />

              <div className="flex flex-col items-center gap-1">
                <h1 className="text-xl font-bold text-center capitalize">
                  {restos.name}
                </h1>

                <p className="opacity-70 text-base font-normal text-center">
                  {resInfo.description}
                </p>
              </div>

              <div className="flex flex-col items-center w-full gap-2">
                <h3 className="text-lg font-bold self-start text-black">{t('info.FollowUs')}</h3>
                <div className="flex 	 justify-center items-center gap-2 py-2">
                  {socialMediaLinks.map((item, index) => (
                    <div key={index} className="w-10 h-10 rounded-full border border-1 border-grey/50 grid text-[#28509E] place-content-center mx-auto">
                      <Link to={item.link} target="_blank">
                        <item.icon
                          size={20}
                          color={customization?.selectedIconColor} style={{ mixBlendMode: 'difference' }}
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

              <div className="w-full p-4 bg-gray-100 rounded-lg">
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>

                <DialogTrigger asChild >
                  <div className="bg-gray-100 flex items-center gap-2 justify-around dark:bg-gray-700 rounded-lg p-4 w-full mb-6"
                  >
                    <div >
                      <HiLanguage className='w-6 h-6' />

                    </div>
                    <h2 className="text-md flex-1 font-normal ">{t("info.changeLanguage")}</h2>
                    <FaChevronRight className='' />

                  </div>
                </DialogTrigger>
                <DialogContent className="w-[80%] gap-0 px-[20px] py-[23px] rounded-lg">
                  <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <DialogTitle className="text-lg tracking-wide font-bold text-gray-700">Select Language</DialogTitle>
                  </DialogHeader>

                  <Card className="w-full  border-none mx-auto">
                    <ul className="divide-y">
                      {Object.keys(languageMap).map((code) => (
                        <li key={code}>
                          <button
                            className={`flex items-center justify-between w-full px-2 py-4 text-md font-medium text-left hover:bg-muted/50 transition-colors ${selectedLanguageCode === code ? 'text-[' + customization?.selectedPrimaryColor + ']' : 'text-muted-foreground'}`}
                            onClick={() => handleLanguageChange(code)}
                          >
                            {languageMap[code]}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Card>

                </DialogContent>
              </Dialog>

            </div>
          </div>
        </ScrollArea>
      </DialogContent>

    </Dialog>
  );
};

export default ThemeOneInfo;