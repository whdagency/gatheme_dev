import { Link, useLocation } from "react-router-dom";
import Trust from './trustpilot-2.svg';
import Google from './icons8-google.svg';
import Spinner from 'react-spinner-material';
import { useTranslation } from "react-i18next";

import callWaiterSvg from "@/Theme01/MenuItems/callWaiter.svg"

import Logo from '@/Theme01/MenuItems/waiter-svgrepo-com.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { useMenu } from "../../hooks/useMenu";
import { Button } from '@/components/ui/button';
import { useState } from "react";
import FeedBack from "../../components/FeedBack";
export default function Rate({ infoRes, slug }) {
  if (!infoRes) {
    return (
      <div className='justify-center items-center flex h-screen'>
        <Spinner size={100} spinnerColor={"#28509E"} spinnerWidth={1} visible={true} style={{ borderColor: "#28509E", borderWidth: 2 }} />
      </div>
    );
  }
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const table_id = extraInfo;
  const [isOpenModelGoogle, setIsOpenModelGoogle] = useState(false)
  const [isOpenModelTrust, setIsOpenModelTrust] = useState(false)
  const { google_buss, trustpilot_link } = infoRes;
  const { submitBille, customization, callWaiter, subscriptionPlan  } = useMenu();
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";
  const [t, i18n] = useTranslation("global")
  return (
    <main className="flex flex-col items-center justify-center h-screen px-4 ">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-[#333] dark:text-[#f8f8f8]">{t("rating.leaveReview")}</h1>
        {
          (hasGoogle || hasTrustpilot) &&
          <p className="text-[#666] dark:text-[#ccc]">{t("rating.btnReview")}</p>
        }
        <div className="grid grid-cols-1 gap-4 w-full">
          {/* {hasGoogle && (
            <Link
              className="bg-gray-200 hover:bg-blue-400 hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              to={google_buss}
            >
              <img src={Google} alt="Google Reviews" className="w-8 h-8 mr-2" />
              Google Reviews
            </Link>
          )} */}
          {hasGoogle && (
            <button
              className="bg-gray-200 hover:bg-blue-400 hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setIsOpenModelGoogle(true)}
            >
              <img src={Google} alt="Google Reviews" className="w-8 h-8 mr-2" />
              Google Reviews
            </button>
          )}

          <FeedBack 
            isModalOpen={isOpenModelGoogle}
            setIsModalOpen={setIsOpenModelGoogle}
            slug={slug}
            table_id={table_id}
            hasTrustpilot={hasGoogle}
            trustpilot_link={google_buss}
            />

          {hasTrustpilot && hasGoogle && (
            <p className="text-[#666] dark:text-[#ccc]">{t("menu.or")}</p>
          )}
          {/* {hasTrustpilot && (
            <Link
              className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              to={trustpilot_link}
            >
              <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
              Trustpilot Reviews
            </Link>
          )} */}
          {hasTrustpilot && (
            <button
              className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
               onClick={() => setIsOpenModelTrust(true)}
            >
              <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
              Trustpilot Reviews
            </button>
          )}
          
          <FeedBack 
            isModalOpen={isOpenModelTrust}
            setIsModalOpen={setIsOpenModelTrust}
            slug={slug}
            table_id={table_id}
            hasTrustpilot={hasTrustpilot}
            trustpilot_link={trustpilot_link}
            />
          
          {!hasGoogle && !hasTrustpilot && (
            <p className="text-[#666] dark:text-[#ccc]">{t("rating.desc")}</p>
          )}
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild className={`mb-1 fixed bottom-16 right-2 md:right-[25%] lg:right-[32%] xl:right-[35%] flex-col flex items-end justify-center `}>
          <Button className="h-16 w-16 rounded-full  shadow-lg flex items-center justify-center" size="icon" style={{ backgroundColor: customization?.selectedPrimaryColor }}>
            <img src={Logo} alt="Waiter Icon" className="h-12 w-11" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[80%] md:w-full mx-auto rounded-lg">

          <AlertDialogHeader className={`${infoRes.language === 'ar' ? ' ml-auto' : ''}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}>
            <img src={callWaiterSvg} alt="Call Waiter" />
            <AlertDialogTitle>{t("waiter.CallWaiter")}</AlertDialogTitle>
            <AlertDialogDescription>{t("waiter.please")}</AlertDialogDescription>

          </AlertDialogHeader>
          <AlertDialogFooter className='flex !flex-col !justify-center  w-full gap-2'>

            <AlertDialogAction 
              className="w-full !px-0 " 
              style={{ backgroundColor: customization?.selectedPrimaryColor }} 
              onClick={() => {
                if (!subscriptionPlan?.canOrderFeatures) return;
                callWaiter();
              }}
              disabled={!subscriptionPlan?.canOrderFeatures}
            >
                {t("waiter.CallWaiter")}
            </AlertDialogAction>
            <AlertDialogAction 
              variant="outline" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full border-[#28509E] bg-white text-black !ml-0" 
              style={{ borderColor: customization?.selectedPrimaryColor, color: customization?.selectedPrimaryColor }} 
              onClick={() => {
                if (!subscriptionPlan?.canOrderFeatures) return;
                submitBille();
              }}
              disabled={!subscriptionPlan?.canOrderFeatures}
            >
                {t("waiter.BringTheBill")}
            </AlertDialogAction>
            <AlertDialogCancel className="absolute top-1 right-2 rounded-full border-none">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
