import React, { useState } from "react";
import { useMenu } from "../../hooks/useMenu";
import Spinner from "react-spinner-material";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import Trust from "./trustpilot-2.svg";
import Google from "./icons8-google.svg";
import Rating from "./RatIcon.svg";
import { useTranslation } from "react-i18next";
import FeedBack from "../../components/FeedBack";

const ThemeOneRating = () => {
  const { resInfo, customization } = useMenu();

  if (!resInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size={100}
          spinnerColor={"#28509E"}
          spinnerWidth={1}
          visible={true}
          style={{ borderColor: "#28509E", borderWidth: 2 }}
        />
      </div>
    );
  }
  const [isOpenModelGoogle, setIsOpenModelGoogle] = useState(false)
  const [isOpenModelTrust, setIsOpenModelTrust] = useState(false)
  const { google_buss, trustpilot_link } = resInfo;
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

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
  return (
    <Dialog>
      <DialogTrigger className="flex w-1/3 items-center justify-center gap-1.5 bg-transparent hover:bg-transparent">
        <FaRegStar size={25}
          fill={customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor} className="text-white" />
        <span
          style={{ color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
          className="text-xs font-medium text-white">{t('menu.rating')}</span>
      </DialogTrigger>

      <DialogContent className='flex !py-0 justify-center items-center h-[84%] w-[85%] rounded-lg'>
        <main className="flex flex-col mt-8 items-stretch justify-center h-[80%] px-1 w-full">

          <div className="space-y-7 text-center">

            <img src={Rating} alt="TrustPilot" className="w-full h-[30vh] mx-auto" />

            <h1 className="text-2xl capitalize font-bold text-[#333] dark:text-[#f8f8f8]">
              {t('rating.leaveReview')}
            </h1>

            {(hasGoogle || hasTrustpilot) && (
              <p className="text-[#666]  dark:text-[#ccc]">
                {t('rating.btnReview')}
              </p>
            )}

            <div className="grid w-full grid-cols-1 gap-2">
              {/* {hasGoogle && (
                <Link
                  className="hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2 px-2 py-3 font-bold text-black transition-colors bg-gray-200 rounded-lg"
                  to={google_buss}
                  target="_blank"
                >
                  <img
                    src={Google}
                    alt="Google Reviews"
                    className="w-8 h-8 mr-2"
                  />
                  Google Reviews
                </Link>
              )} */}
              {hasGoogle && (
                <button
                  className="hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2 px-2 py-3 font-bold text-black transition-colors bg-gray-200 rounded-lg"
                  onClick={() => setIsOpenModelGoogle(true)}
                  target="_blank"
                >
                  <img
                    src={Google}
                    alt="Google Reviews"
                    className="w-8 h-8 mr-2"
                  />
                  Google Reviews
                </button>
              )}
              <FeedBack 
                isModalOpen={isOpenModelGoogle}
                setIsModalOpen={setIsOpenModelGoogle}
                hasTrustpilot={hasGoogle}
                trustpilot_link={google_buss}
                isTheme1={false}
                />
              {hasTrustpilot && hasGoogle && (
                <p className="text-[#666] dark:text-[#ccc]">{t('menu.or')}</p>
              )}
              {/* {hasTrustpilot && (
                <Link
                  className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  to={trustpilot_link}
                  target="_blank"
                >
                  <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
                  Trustpilot Reviews
                </Link>
              )} */}
              {hasTrustpilot && (
                <button
                  className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  onClick={() => setIsOpenModelTrust(true)}
                  target="_blank"
                >
                  <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
                  Trustpilot Reviews
                </button>
              )}
              <FeedBack 
                isModalOpen={isOpenModelTrust}
                setIsModalOpen={setIsOpenModelTrust}
                hasTrustpilot={hasTrustpilot}
                trustpilot_link={trustpilot_link}
                isTheme1={false}
                />
              {!hasGoogle && !hasTrustpilot && (
                <p className="text-[#666] dark:text-[#ccc]">
                  {t('rating.desc')}
                </p>
              )}
            </div>
            <DialogClose>
              <img
                src="/assets/close.svg"
                alt="close button"
                className="absolute top-3 right-3 w-8 h-8"
              />
            </DialogClose>
          </div>

        </main>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeOneRating;
