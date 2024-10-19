import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hexToRgba } from "../lib/utils";

const CartItemDetails = ({ item, customization, initiallyOpened, index }) => {
  const { t } = useTranslation("global");
  const [isDetailsOpen, setIsDetailsOpen] = useState(initiallyOpened);
  const extravariants = item.extravariants;
  const toppings = item.toppings;
  const ingredients = item?.ingredients;
  const isIngredientsEmpty =
    ingredients?.map((ing) => ing.name).join(", ")?.length === 0;
  const comment = item.comment;

  const isEmpty =
    !extravariants?.length &&
    !toppings?.length &&
    isIngredientsEmpty &&
    !comment;

  return (
    <div className={`${isEmpty ? "hidden" : ""} `}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        className="flex items-center justify-between w-full mb-2 text-gray-600"
      >
        <span
          className="font-semibold text-sm text-[#8C8C8C]"
          style={{
            color: customization?.selectedSecondaryColor,
          }}
        >
          {t("cart.orderDetails")}
        </span>
        {isDetailsOpen ? (
          <ChevronUp
            size={20}
            color={customization?.selectedSecondaryColor ?? "#8C8C8C"}
          />
        ) : (
          <ChevronDown
            size={20}
            color={customization?.selectedSecondaryColor ?? "#8C8C8C"}
          />
        )}
      </motion.button>

      <AnimatePresence initial={false}>
        {isDetailsOpen && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 overflow-hidden text-sm font-medium"
          >
            <div className="flex flex-col gap-1">
              <h3
                className="text-base font-semibold text-[#545454] hidden"
                style={{
                  color: hexToRgba(customization?.selectedTextColor, 0.7),
                }}
              >
                {t("cart.orderNo")} #{index + 1}
              </h3>

              {toppings?.length > 0 &&
                toppings.map((top, index) => (
                  <p key={index} className="flex items-center gap-1">
                    <span
                      className="text-[#545454] capitalize"
                      style={{
                        color: hexToRgba(customization?.selectedTextColor, 0.7),
                      }}
                    >
                      {top.name} :
                    </span>{" "}
                    <span
                      className="text-[#A9A9A9] capitalize"
                      style={{
                        color: customization?.selectedSecondaryColor,
                        display: top.options?.length ? "block" : "none",
                      }}
                    >
                      {top.options?.map((op) => op.name).join(", ") ||
                        t("cart.none")}
                    </span>
                  </p>
                ))}

              {extravariants?.length > 0 &&
                extravariants.map((extra, index) => (
                  <p key={index} className="flex items-center gap-1">
                    <span
                      className="text-[#545454] capitalize"
                      style={{
                        color: hexToRgba(customization?.selectedTextColor, 0.7),
                      }}
                    >
                      {extra.name} :
                    </span>{" "}
                    <span
                      className="text-[#A9A9A9] capitalize"
                      style={{
                        color: customization?.selectedSecondaryColor,
                        display: extra.options?.length ? "block" : "none",
                      }}
                    >
                      {extra.options?.map((op) => op.name).join(", ") ||
                        t("cart.none")}
                    </span>
                  </p>
                ))}

              {ingredients?.length > 0 && !isIngredientsEmpty && (
                <p className="flex items-center gap-1">
                  <span
                    className="text-[#545454]"
                    style={{
                      color: hexToRgba(customization?.selectedTextColor, 0.7),
                    }}
                  >
                    {t("cart.ingredients")}
                  </span>{" "}
                  <span
                    className="text-[#A9A9A9] capitalize"
                    style={{
                      color: customization?.selectedSecondaryColor,
                      display: ingredients?.length ? "block" : "none",
                    }}
                  >
                    {ingredients?.map((ing) => ing.name).join(", ")?.length}
                  </span>
                </p>
              )}

              {comment && comment !== "" && (
                <p className="flex items-center gap-1">
                  <span
                    className="text-[#545454]"
                    style={{
                      color: hexToRgba(customization?.selectedTextColor, 0.7),
                    }}
                  >
                    {t("cart.comment")}
                  </span>{" "}
                  <span
                    className="text-[#A9A9A9]"
                    style={{
                      color: customization?.selectedSecondaryColor,
                    }}
                  >
                    {comment || t("cart.noComment")}
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartItemDetails;
