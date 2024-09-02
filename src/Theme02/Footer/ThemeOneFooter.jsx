import React, { useState, useEffect, useRef } from "react";
import { useMenu } from "../../hooks/useMenu";
import { APIURL } from "../../lib/ApiKey";
import ThemeOneRating from "../Rating/ThemeOneRating";
import ThemeOneClaims from "../Claims/ThemeOneClaims";
import { useTranslation } from "react-i18next";

import {
  WaiterIcon,
  WaiterCancelIcon,
  CallWaiterIcon,
  BringBillIcon,
  ClaimsFilledIcon,
  ClaimsOutlineIcon,
} from "../icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import bringBill from "./bringBill.svg";
import callWaiter from "./callWaiter.svg";
const ThemeOneFooter = () => {
  const { customization, table_id, restos, restoSlug } = useMenu();
  const [openClaimsModal, setOpenClaimsModal] = useState(false);
  const [openSubmitItemModal, setOpenSubmitItemModal] = useState({
    open: false,
    title: "",
    description: "",
  });

  // get resto id
  const resto_id = restos.id;
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  // submit notification for waiter or bill
  const submitNotification = async ({
    type,
    title,
    alertDialogTitle,
    alertDialogDescription,
  }) => {
    try {
      const notification = {
        title: title,
        status: type,
        resto_id: resto_id,
        table_id: table_id,
      };
      const responseNotification = await fetch(`${APIURL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (responseNotification) {
        console.log("Notification Response => ", responseNotification);

        setOpenSubmitItemModal({
          open: true,
          title: alertDialogTitle,
          description: alertDialogDescription,
          // title: "Bill Requested!",
          // description: "The bill will be sent to you shortly.",
        });
      }
    } catch (error) {
      console.error("Failed to submit notification:", error.message);
    }
  };

  return (
    <footer
      style={{ backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}
      className="md:max-w-sm bottom-5 fixed z-50 flex items-center justify-center w-full h-[56px] max-w-xs gap-5 mx-auto rounded"
    >
      <div className="z-20 flex items-center justify-around w-full">
        <ThemeOneRating />

        <CallWaiter
          customization={customization}
          submitNotification={submitNotification}
        />

        <ClaimsTrigger open={openClaimsModal} setOpen={setOpenClaimsModal} />
      </div>

      <ThemeOneClaims open={openClaimsModal} setOpen={setOpenClaimsModal} />

      <SubmitItemModal
        openSubmitItemModal={openSubmitItemModal}
        setOpenSubmitItemModal={setOpenSubmitItemModal}
      />
    </footer>
  );
};

export default ThemeOneFooter;

// claims trigger button
const ClaimsTrigger = ({ open, setOpen }) => {
  const { customization } = useMenu();
  const { t, i18n } = useTranslation("global");

  return (
    <button
      onClick={() => setOpen((prev) => !prev)}
      className="flex items-center w-1/3 justify-center gap-1.5 bg-transparent hover:bg-transparent"
    >
      {open ? (
        <ClaimsFilledIcon
          width={25}
          height={25}
          fill={customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor}
        />
      ) : (
        <ClaimsOutlineIcon
          width={25}
          height={25}
          fill={customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor}
        />
      )}
      <span
        style={{ color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
        className="text-xs font-medium text-white"
      >
        {t('claims.claim')}
      </span>
    </button>
  );
};

// call a waiter
const CallWaiter = ({ customization, submitNotification }) => {
  const [openWaiterModal, setOpenWaiterModal] = useState(false);
  const modalRef = useRef();
  const { t, i18n } = useTranslation("global");

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenWaiterModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCallWaiter = () => {
    submitNotification({
      type: "Waiter",
      title: "New Call For Waiter",
      alertDialogTitle: `${t('waiter.WaiterRequested')}`,
      alertDialogDescription: `${t('waiter.msgwaiter')}`,
    });
  };

  const handleBringBill = () => {
    submitNotification({
      type: "Bill",
      title: "Asking For Bill",
      alertDialogTitle: `${t('waiter.BillRequested')}`,
      alertDialogDescription: `${t('waiter.msgbill')}`,
    });
  };

  return (
    <section ref={modalRef}>
      <button
        onClick={() => setOpenWaiterModal((prev) => !prev)}
        className="flex items-center justify-center my-auto w-16 h-16 p-1.5  rounded-full"
        id="call-waiter-button"
      >
        <WaiterIcon
          style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
          fill={customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor}
          className="object-contain w-full h-full p-2 rounded-full"
        />
      </button>

      <div
        style={{ backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}
        className={`flex flex-col ${openWaiterModal
          ? "transition-transform scale-100 translate-y-0 duration-500"
          : "transition-transform scale-0 duration-500 translate-y-20"
          } md:shadow-sm items-center justify-center gap-3 py-5 px-10 w-full mx-auto bg-black/70 absolute bottom-[46.3px] md:bottom-14 left-1/2 transform -translate-x-1/2 rounded-t-full h-[119px] -z-10`}
      >
        <div className="flex items-center justify-center w-full gap-1 mt-8">
          <div className="flex flex-row items-center justify-center gap-[30px]">
            {/* Call Waiter */}

            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <button
                    // onClick={handleCallWaiter}
                    className="flex items-center justify-center w-12 h-12 bg-transparent rounded-full"
                    size="icon"
                  >
                    <CallWaiterIcon
                      style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}

                      fill={customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor}
                      className="object-contain w-full h-full p-2 rounded-full"
                    />
                  </button>
                  <p
                    style={{ color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
                    className="text-[10px] text-center font-medium text-white"
                  >
                    {t('menu.callWaiter')}
                  </p>
                </div>
              </AlertDialogTrigger >
              <AlertDialogContent className="w-[65%] rounded-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="self-center">
                    <img src={callWaiter} alt="Call Waiter Icon" />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Would you like the waiter to attend to you?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-2 items-center justify-center">
                  <AlertDialogCancel variant="outline" className="inline-flex items-center mt-0 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground  px-4  bg-white text-black " style={{ borderColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }} >Cancel</AlertDialogCancel>
                  <AlertDialogAction className="!p-1.5   " style={{ backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }} onClick={handleCallWaiter}>{t("waiter.CallWaiter")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Bring Bill */}

            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div className="flex flex-col w-full items-center justify-center gap-2 -mt-16">
                  <button
                    // onClick={handleBringBill}
                    className="flex items-center justify-center w-12 h-12 bg-transparent rounded-full"
                    size="icon"
                  >
                    <BringBillIcon
                      style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
                      fill={customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor}
                      className="object-contain w-full h-full p-2 rounded-full"
                    />
                  </button>
                  <p
                    style={{ color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
                    className="text-[10px] font-medium text-nowrap text-white"
                  >
                    {t('menu.bringBill')}
                  </p>
                </div>
              </AlertDialogTrigger >
              <AlertDialogContent className="w-[65%] rounded-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="self-center">
                    <img src={bringBill} alt="Bring Bill Icon" />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Would you like the bill to be sent to your Table?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-2 items-center justify-center">
                  <AlertDialogCancel variant="outline" className="inline-flex items-center mt-0 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground  px-4  bg-white text-black " style={{ borderColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }} >Cancel</AlertDialogCancel>
                  <AlertDialogAction className="!p-1.5   " style={{ backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }} onClick={handleBringBill}>{t("waiter.BringTheBill")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Cancel */}
            <div className="flex flex-col w-1/3 items-center justify-center gap-2">
              <button
                onClick={() => setOpenWaiterModal((prev) => !prev)}
                className="flex items-center justify-center w-12 h-12 bg-transparent rounded-full"
                size="icon"
              >
                <WaiterCancelIcon
                  style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
                  fill={customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor}
                  className="object-contain w-full h-full p-3.5 rounded-full"
                />
              </button>
              <p
                style={{ color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
                className="text-[10px] font-medium text-center text-white"
              >
                {t('menu.cancel')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SubmitItemModal = ({ openSubmitItemModal, setOpenSubmitItemModal }) => {
  const { customization } = useMenu();
  const { t, i18n } = useTranslation("global");
  return (
    <AlertDialog open={openSubmitItemModal.open}>
      <AlertDialogContent className="w-[80%] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-center text-black">
            {openSubmitItemModal.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-center gap-1 text-sm font-normal text-center text-gray-500">
            <span>{openSubmitItemModal.description}</span>
            <span>Thank you for using our service.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            autoFocus
            onClick={() =>
              setOpenSubmitItemModal((prev) => ({ ...prev, open: !prev.open }))
            }
            style={{
              backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor,
              color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor,
            }}
            className="flex items-center justify-center w-full gap-2 mx-auto font-normal text-center text-white"
          >
            {t('waiter.Confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};