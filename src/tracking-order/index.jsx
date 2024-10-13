import { ArrowLeft, CheckIcon, XIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { api, STORAGE_URL } from "../lib/api";
import { database, onValue, ref } from "../firebaseConfig";
import { motion } from "framer-motion";
import { OrderSpinnerIcon, StarOutline } from "../components/icons";
import NoOrdersFound from "./NoOrdersFound";
import OrderCancelled from "../modals/order-cancelled";
import { useMenu } from "../hooks/useMenu";
import AnimatedLayout from "../shared/AnimateLayout";
import { hexToRgba } from "../lib/utils";
import { useTranslation } from "react-i18next";
import OrderSuccessFeedback from "../modals/order-success-feedback";

const TrackingOrder = () => {
  const { setOrderID, orderID, customization } = useMenu();
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [status, setStatus] = useState(null);
  const [orders, setOrders] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [orderCanceledModal, setOrderCanceledModal] = useState(false);
  const { t } = useTranslation("global");

  const fetchValues = useCallback(async () => {
    try {
      const res = localStorage.getItem("orderID");
      if (res === null || res === "null") {
        localStorage.setItem("orderID", null);
        setOrderID(null);
        return false;
      }

      setOrderID(res);

      const result = await api.get(`/order/${res}`);

      const data = result?.data?.order;

      if (result) {
        setOrders(result?.data);
        setStatus(data?.status);
        if (data?.status == "New" || data?.status == "Accepted") {
          setCurrentStep(1);
          setComplete(false);
          setCanceled(false);
          setOrderCanceledModal(false);
          setShowFeedbackModal(false);
        } else if (data?.status == "Preparing") {
          setCurrentStep(2);
          setComplete(false);
          setCanceled(false);
          setOrderCanceledModal(false);
          setShowFeedbackModal(false);
        } else if (data?.status == "Ready") {
          setCurrentStep(3);
          setComplete(false);
          setCanceled(false);
          setOrderCanceledModal(false);
          setShowFeedbackModal(false);
        } else if (data?.status == "Completed") {
          setCurrentStep(4);
          setComplete(false);
          setTimeout(() => {
            setComplete(true);
            setShowFeedbackModal(true);
            setOrderCanceledModal(false);
            localStorage.setItem("orderID", null);
            setOrderID(null);
          }, 1000);
          setCanceled(false);
        } else if (data?.status == "Rejected") {
          setCurrentStep(1);
          setCanceled(true);
          setComplete(false);
          setTimeout(() => {
            setOrderCanceledModal(true);
            setShowFeedbackModal(false);
            localStorage.setItem("orderID", null);
            setOrderID(null);
          }, 2000);
        }
      }
    } catch (err) {
      console.log("The Error => ", err);
      if (err?.status === 404) {
        localStorage.setItem("orderID", null);
        setOrderID(null);
      }
    }
  }, [setOrderID]);

  const subscribeToFirebase = useCallback(() => {
    const ordersRef = ref(database, "orders");
    onValue(ordersRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        fetchValues();
      }
    });
  }, [fetchValues]);

  useEffect(() => {
    fetchValues();
    subscribeToFirebase();
  }, [fetchValues, subscribeToFirebase]);

  if (!orders) {
    return (
      <AnimatedLayout>
        <NoOrdersFound showFeedback={showFeedbackModal} />
      </AnimatedLayout>
    );
  }

  const statusSteps = [
    { step: 1, label: t("trackingOrder.newOrder"), status: "New" },
    { step: 2, label: t("trackingOrder.preparingFood"), status: "Preparing" },
    { step: 3, label: t("trackingOrder.orderReady"), status: "Ready" },
    { step: 4, label: t("trackingOrder.orderCompleted"), status: "Completed" },
  ];

  return (
    <AnimatedLayout>
      {!orderID && <NoOrdersFound showFeedback={showFeedbackModal} />}
      <div className="pt-28 relative pb-32">
        {/* Title and Back Button */}
        {orderID && (
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
        )}

        {orderID && (
          <h2
            className="top-12 absolute z-50 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {!showFeedbackModal
              ? t("trackingOrder.title")
              : t("trackingOrder.orderFeedback")}
          </h2>
        )}

        {orderID && (
          <div>
            <div className="pb-48 my-4">
              <h3
                className="px-7 md:text-lg pb-2 text-base font-semibold border-b"
                style={{
                  color: customization?.selectedTextColor,
                }}
              >
                {t("cart.orderNo")}: #{orders.order.id}
              </h3>

              <div className="px-7 flex flex-col gap-2 pt-4">
                {orders.dishes.map(
                  ({ image, name: title, quantity }, index) => (
                    <div
                      key={index}
                      className="last:border-b-0 flex flex-col justify-center gap-3 pb-3 border-b"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start justify-between">
                          <h3
                            className="text-base font-semibold text-black capitalize"
                            style={{
                              color: customization?.selectedTextColor,
                            }}
                          >
                            {title}
                          </h3>

                          <span
                            className="text-sm font-medium text-[#9F9F9F]"
                            style={{
                              color: customization?.selectedSecondaryColor,
                            }}
                          >
                            x{quantity}
                          </span>
                        </div>

                        <img
                          src={
                            image.includes("default_images")
                              ? ""
                              : `${STORAGE_URL}/${image}`
                          }
                          alt={title}
                          className="rounded-xl object-cover w-[50px] h-[50px] shadow-sm"
                          onError={(e) =>
                            (e.target.src = "/assets/placeholder-image.png")
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <h3
                          className="text-base font-medium text-[#B3B3B3] capitalize"
                          style={{
                            color: customization?.selectedSecondaryColor,
                            opacity: 0.7,
                          }}
                        >
                          {t("productDetails.rating")}
                        </h3>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarOutline key={index} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bottom-5 fixed left-0 right-0 flex items-center justify-between w-full max-w-xl py-0 mx-auto mt-2 -mb-5 bg-white border-t border-gray-200">
              <div className="px-7">
                <OrderTrackingTimeline
                  steps={statusSteps}
                  status={status}
                  currentStep={currentStep}
                  complete={complete}
                  canceled={canceled}
                  customization={customization}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderSuccessFeedback
        open={showFeedbackModal}
        setOpen={setShowFeedbackModal}
      />

      <OrderCancelled
        open={orderCanceledModal}
        setOpen={setOrderCanceledModal}
      />
    </AnimatedLayout>
  );
};

export default TrackingOrder;

const OrderTrackingTimeline = ({
  steps,
  status,
  currentStep,
  complete,
  canceled,
  customization,
}) => {
  const { t } = useTranslation("global");
  return (
    <div className="max-w-xl p-6 mx-auto">
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.step} className="last:mb-0 flex items-center mb-8">
            <div className="relative flex items-center justify-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  step.step <= currentStep
                    ? "bg-[#F86A2E] border-2 border-[#F86A2E]"
                    : "bg-white border-2 border-[#E5E5E5]"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  background:
                    step.step <= currentStep
                      ? customization?.selectedPrimaryColor
                      : customization?.selectedBgColor,
                  borderColor:
                    step.step <= currentStep
                      ? customization?.selectedPrimaryColor
                      : hexToRgba(customization?.selectedSecondaryColor, 0.3),
                }}
              >
                {step.step === currentStep &&
                  (complete ? (
                    <CheckIcon
                      size={20}
                      color={customization?.selectedIconColor ?? "#FFFFFF"}
                    />
                  ) : canceled ? (
                    <XIcon
                      size={20}
                      color={customization?.selectedIconColor ?? "#FFFFFF"}
                    />
                  ) : (
                    <OrderSpinnerIcon />
                  ))}
                {step.step < currentStep && (
                  <CheckIcon
                    size={20}
                    color={customization?.selectedIconColor ?? "#FFFFFF"}
                  />
                )}
                {step.step > currentStep && (
                  <span
                    className="font-bold text-center text-[#D6D6D6]"
                    style={{
                      color: customization?.selectedSecondaryColor,
                    }}
                  >
                    {step.step}
                  </span>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className={`absolute w-0.5 ${
                    step.step < currentStep ? "bg-[#F86A2E]" : "bg-[#E5E5E5]"
                  } mt-1`}
                  style={{
                    top: "2.5rem",
                    height: "1.5rem",
                    left: "20px",
                    background:
                      step.step < currentStep
                        ? customization?.selectedPrimaryColor
                        : hexToRgba(customization?.selectedSecondaryColor, 0.3),
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                />
              )}
            </div>
            <div className="flex flex-col pt-1 ml-4">
              <span
                className="mb-1 text-[10px] uppercase font-bold text-[#B5B5B5]"
                style={{
                  color: customization?.selectedSecondaryColor,
                }}
              >
                {t("trackingOrder.stepNo", { stepNo: step.step })}
              </span>
              <span
                className={`text-xs font-semibold ${
                  canceled ? "line-through text-red-500" : ""
                }`}
                style={{
                  color: canceled
                    ? "#ef4444"
                    : customization?.selectedTextColor,
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
