import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { ArrowLeft } from "lucide-react";
import { hexToRgba } from "../lib/utils";

const NoOrdersFound = ({ showFeedback = false }) => {
  const { table_id, restoSlug, customization } = useMenu();

  return (
    <div className={`${showFeedback ? "pt-10" : "pt-28"} relative pb-32`}>
      {/* Title and Back Button */}
      <button
        style={{
          boxShadow: "0px 1.633px 1.633px 0px rgba(0, 0, 0, 0.25)",
          borderRadius: "13.061px",
          background: "#FFF",
        }}
        onClick={() => window.history.back()}
        className="flex top-10 left-7 absolute z-50 w-fit items-center justify-center p-[8.163px] gap-[8.163px]"
      >
        <ArrowLeft size={25} color="black" />
      </button>

      <h2
        className="font-[Poppins] top-12 absolute z-50 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-black"
        style={{
          color: customization?.selectedSecondaryColor,
        }}
      >
        {!showFeedback ? "Tracking Details" : "Order Feedack"}
      </h2>

      <div className="flex flex-col items-center justify-center gap-3 px-12">
        <div className="flex items-center justify-center gap-2 shrink-0 p-[24px_27px]">
          <img
            src={
              showFeedback
                ? "/assets/order-feedback.png"
                : "/assets/cart-empty.png"
            }
            alt={showFeedback ? "Order Feedback" : "Empty Cart"}
            className={!showFeedback ? "w-[225px] h-[225px]" : "w-full h-full"}
          />
        </div>

        {!showFeedback && (
          <h3
            className="text-base font-semibold text-center text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            No Orders Found
          </h3>
        )}

        {!showFeedback && (
          <p
            className="text-[15px] px-10 text-center leading-[19.5px] font-medium text-[#A5A4A8]"
            style={{
              color: customization?.selectedSecondaryColor,
            }}
          >
            Looks like you haven&apos;t ordered anything yet.
          </p>
        )}

        {!showFeedback && (
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
                Start Ordering
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoOrdersFound;
