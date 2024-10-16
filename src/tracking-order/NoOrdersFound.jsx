import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { ArrowLeft } from "lucide-react";
import { hexToRgba } from "../lib/utils";
import { useTranslation } from "react-i18next";

const NoOrdersFound = ({
  showFeedback = false,
  showSuccess = false,
  setShowSuccess = () => {},
}) => {
  const { table_id, restoSlug, customization } = useMenu();
  const { t } = useTranslation("global");
  const isFeedback = showFeedback || showSuccess;

  return (
    <div
      className={`${
        isFeedback ? "pt-10 pb-32" : "pt-28 pb-12"
      } relative flex flex-col items-center justify-between h-screen`}
    >
      {/* Title and Back Button */}
      <button
        style={{
          boxShadow: "0px 1.633px 1.633px 0px rgba(0, 0, 0, 0.25)",
          borderRadius: "13.061px",
          background: "#FFF",
        }}
        onClick={() => {
          if (showSuccess) {
            setShowSuccess(false);
          } else {
            window.history.back();
          }
        }}
        className="flex top-10 left-7 absolute z-50 w-fit items-center justify-center p-[8.163px] gap-[8.163px]"
      >
        <ArrowLeft size={25} color="black" />
      </button>

      <h2
        className="top-12 left-1/2 absolute z-50 text-xl font-semibold text-center text-black -translate-x-1/2"
        style={{
          color: customization?.selectedTextColor,
        }}
      >
        {!isFeedback ? t("trackingOrder.title") : t("trackingOrder.process")}
      </h2>

      <div className="md:-mt-14 flex flex-col items-center justify-center flex-1 gap-3 px-12">
        <div className="flex items-center justify-center md:p-[24px_27px]">
          <img
            src={
              isFeedback
                ? "/assets/order-feedback.png"
                : "/assets/cart-empty.png"
            }
            alt={isFeedback ? "Order Feedback" : "Empty Cart"}
            className={!isFeedback ? "w-[225px] h-[225px]" : "w-full h-full"}
          />
        </div>

        <div
          className={`flex flex-col items-center gap-3 text-center ${
            isFeedback ? "-mt-8 md:-mt-16" : "-mt-0"
          }`}
        >
          <h3
            className="text-base font-semibold text-center text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {isFeedback
              ? t("trackingOrder.orderFeedbackSuccess")
              : t("trackingOrder.noOrdersFound")}
          </h3>

          <p
            className="text-[15px] px-10 text-center leading-[19.5px] font-medium text-[#A5A4A8]"
            style={{
              color: customization?.selectedSecondaryColor,
            }}
          >
            {isFeedback
              ? t("trackingOrder.orderFeedbackSuccessDesc")
              : t("trackingOrder.noOrdersFoundDesc")}
          </p>
        </div>

        {!isFeedback && (
          <div className="mt-7 flex flex-col items-center w-[186px] gap-4">
            <Link
              to={`/menu/${restoSlug}?table_id=${table_id}`}
              className="w-full"
            >
              <button
                className="w-full py-4 text-[#F86A2E] bg-[#FCEEEC] rounded-full text-sm text-center font-medium"
                style={{
                  background: hexToRgba(
                    customization?.selectedPrimaryColor,
                    0.3
                  ),
                  color: customization?.selectedPrimaryColor,
                }}
              >
                {t("trackingOrder.startOrdering")}
              </button>
            </Link>
          </div>
        )}
      </div>

      {isFeedback && (
        <div className="bottom-6 absolute flex flex-col mt-auto">
          <span
            style={{
              color: customization?.selectedSecondaryColor,
            }}
            className="-top-8 -left-16 absolute text-base font-light"
          >
            {t("trackingOrder.poweredBy")}
          </span>
          <img
            src="/assets/garista.png"
            alt="garista"
            className="w-[120px] h-[26px] shrink-0 object-contain flex items-center justify-center"
          />
        </div>
      )}
    </div>
  );
};

export default NoOrdersFound;
