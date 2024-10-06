import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import CartItem from "./CartItem";
import { useMenu } from "../hooks/useMenu";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ConfirmOrder from "../modals/confirm-order";
import { api } from "../lib/api";
import { submitNotification } from "../lib/notification";
import SuggestedProducts from "../products/SuggestedProducts";
import AnimatedLayout from "../shared/AnimateLayout";
import { hexToRgba } from "../lib/utils";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const {
    restoSlug,
    table_id,
    resInfo,
    restos,
    tableName,
    setOrderID,
    orderID,
    customization,
  } = useMenu();
  const { t } = useTranslation("global");
  const { items, removeItem } = useCart();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [orderPending, setOrderPending] = useState(false);
  const currency = resInfo?.currency || "MAD";
  const [showSuggestedProducts, setShowSuggestedProducts] = useState(false);
  const [cartWasEmpty, setCartWasEmpty] = useState(false);

  // Get cart items for the current restaurant
  const restocartItems = useMemo(() => {
    return items?.filter((item) => item.resto_id === restos?.id) || [];
  }, [items, restos?.id]);

  // Check if the current restaurant cart is empty
  const isRestoCartEmpty = useMemo(() => {
    return restocartItems.length === 0;
  }, [restocartItems]);

  // Function to get the total price of an item
  const getItemTotalPrice = (item) => {
    let total = parseFloat(item?.productTotal || item.price * item.quantity);
    return total;
  };

  // Function to get the total price of the cart
  const totalPrice = restocartItems.reduce((acc, item) => {
    const total = getItemTotalPrice(item);
    return acc + parseFloat(total.toFixed(2));
  }, 0);

  // Function to delete an item
  const deleteItem = (id) => {
    removeItem(id);
  };

  const clearRestoCart = () => {
    restocartItems.forEach((item) => {
      removeItem(item.id);
    });
  };

  const submitOrder = async () => {
    if (!table_id) {
      toast.error(t("common.actions.selectTable"));
      return;
    }
    setOrderPending(true);

    let cartItemProduct = restocartItems.map((item) => ({
      type: item.type,
      id: item.id,
      quantity: item.quantity,
      comment: item?.comment || "",
      extraVariants: item?.extravariants || [],
      toppings: item?.toppings || [],
      ingrediants: item?.ingredients || [],
    }));

    const order = {
      total: totalPrice,
      status: "New",
      table_id: table_id,
      resto_id: restos.id,
      cartItems: cartItemProduct,
    };

    try {
      const res = await api.post("/order", order);

      if (res.data.message) {
        localStorage.setItem("orderID", JSON.stringify(res.data.order.id));

        await submitNotification({
          type: "Order",
          title: "New Order",
          resto_id: restos.id,
          table_id: table_id,
        });

        setOrderID(res.data.order.id);

        clearRestoCart();

        setOpenConfirmModal(false);
      }
    } catch (error) {
      console.error("Failed to submit order:", error.message);
    } finally {
      setOrderPending(false);
    }
  };

  // check if current restaurant and item restaurants are the same
  useEffect(() => {
    if (!restocartItems || restocartItems.length === 0) {
      return;
    }

    if (restos.id !== restocartItems[0].resto_id) {
      setOrderID(null);
      localStorage.setItem("orderID", null);
    }
  }, [restos.id, restocartItems, setOrderID]);

  useEffect(() => {
    if (isRestoCartEmpty) {
      setShowSuggestedProducts(false);
      return;
    }
    setShowSuggestedProducts(true);

    return () => {
      setShowSuggestedProducts(false);
    };
  }, [isRestoCartEmpty]);

  // Manage when to show suggested products
  useEffect(() => {
    if (isRestoCartEmpty) {
      setShowSuggestedProducts(false);
      setCartWasEmpty(true);
      return;
    }

    // Show suggested products only if the cart was empty and items were added
    if (cartWasEmpty && restocartItems.length > 0) {
      setShowSuggestedProducts(true);
    }

    return () => {
      setShowSuggestedProducts(false);
      setCartWasEmpty(false);
    };
  }, [isRestoCartEmpty, restocartItems.length, cartWasEmpty]);

  return (
    <AnimatedLayout>
      <div className="pt-28 relative pb-32">
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
            color: customization?.selectedTextColor,
          }}
        >
          {t("common.navigation.myCart")}
        </h2>

        <div className="px-7 flex items-center justify-between mt-5 mb-6">
          <p
            className="text-sm font-semibold text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {t("cart.table")}{" "}
            {isNaN(tableName)
              ? tableName
              : tableName?.padStart(3, "0") || table_id?.padStart(3, "0")}
          </p>

          <button
            disabled={isRestoCartEmpty}
            onClick={clearRestoCart}
            className={`font-semibold ${
              isRestoCartEmpty ? "opacity-50" : "opacity-100"
            } text-[#F86A2E] text-sm border-b-2 border-b-[#F86A2E] pb-0.5`}
            style={{
              color: customization?.selectedPrimaryColor,
              borderColor: customization?.selectedPrimaryColor,
            }}
          >
            {t("cart.clearCart")}
          </button>
        </div>

        {!isRestoCartEmpty && (
          <div className="px-7 pb-28 mt-9">
            <div className="flex flex-col gap-5">
              {restocartItems.map((item) => (
                <CartItem
                  key={item.id}
                  title={item.name}
                  price={getItemTotalPrice(item).toFixed(2)}
                  currency={resInfo.currency || "MAD"}
                  id={item.id}
                  removeItem={() => deleteItem(item.id)}
                  quantity={item.quantity}
                  image={item.image1}
                  item={item}
                  customization={customization}
                />
              ))}
            </div>

            <div className="pt-4 mt-4 border-t">
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
                    {restocartItems.map((item, index) => {
                      const extravariants = item.extravariants;
                      const toppings = item.toppings;
                      const ingredients = item.ingredients;
                      const comment = item.comment;

                      return (
                        <div key={index} className="flex flex-col gap-1">
                          <h3
                            className="text-base font-semibold text-[#545454]"
                            style={{
                              color: hexToRgba(
                                customization?.selectedTextColor,
                                0.7
                              ),
                            }}
                          >
                            {t("cart.orderNo")} #{index + 1}
                          </h3>

                          {toppings ? (
                            toppings.map((top, index) => (
                              <p key={index}>
                                <span
                                  className="text-[#545454] capitalize"
                                  style={{
                                    color: hexToRgba(
                                      customization?.selectedTextColor,
                                      0.7
                                    ),
                                  }}
                                >
                                  {top.name} :
                                </span>{" "}
                                <span
                                  className="text-[#A9A9A9] capitalize"
                                  style={{
                                    color:
                                      customization?.selectedSecondaryColor,
                                  }}
                                >
                                  {top.options
                                    ?.map((op) => op.name)
                                    .join(", ") || t("cart.none")}
                                </span>
                              </p>
                            ))
                          ) : (
                            <p>
                              <span
                                className="text-[#545454]"
                                style={{
                                  color: hexToRgba(
                                    customization?.selectedTextColor,
                                    0.7
                                  ),
                                }}
                              >
                                {t("cart.toppings")}
                              </span>{" "}
                              <span
                                className="text-[#A9A9A9]"
                                style={{
                                  color: customization?.selectedSecondaryColor,
                                }}
                              >
                                {t("cart.none")}
                              </span>
                            </p>
                          )}

                          {extravariants ? (
                            extravariants.map((extra, index) => (
                              <p key={index}>
                                <span
                                  className="text-[#545454] capitalize"
                                  style={{
                                    color: hexToRgba(
                                      customization?.selectedTextColor,
                                      0.7
                                    ),
                                  }}
                                >
                                  {extra.name} :
                                </span>{" "}
                                <span
                                  className="text-[#A9A9A9] capitalize"
                                  style={{
                                    color:
                                      customization?.selectedSecondaryColor,
                                  }}
                                >
                                  {extra.options
                                    ?.map((op) => op.name)
                                    .join(", ") || t("cart.none")}
                                </span>
                              </p>
                            ))
                          ) : (
                            <p>
                              <span
                                className="text-[#545454]"
                                style={{
                                  color: hexToRgba(
                                    customization?.selectedTextColor,
                                    0.7
                                  ),
                                }}
                              >
                                {t("cart.extras")}
                              </span>{" "}
                              <span
                                className="text-[#A9A9A9]"
                                style={{
                                  color: customization?.selectedSecondaryColor,
                                }}
                              >
                                {t("cart.none")}
                              </span>
                            </p>
                          )}

                          <p>
                            <span
                              className="text-[#545454]"
                              style={{
                                color: hexToRgba(
                                  customization?.selectedTextColor,
                                  0.7
                                ),
                              }}
                            >
                              {t("cart.ingredients")}
                            </span>{" "}
                            <span
                              className="text-[#A9A9A9] capitalize"
                              style={{
                                color: customization?.selectedSecondaryColor,
                              }}
                            >
                              {ingredients
                                ?.map((ingredient) => ingredient.name)
                                .join(", ") || t("cart.none")}
                            </span>
                          </p>
                          <p>
                            <span
                              className="text-[#545454]"
                              style={{
                                color: hexToRgba(
                                  customization?.selectedTextColor,
                                  0.7
                                ),
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
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {isRestoCartEmpty && (
          <div className="flex flex-col items-center justify-center gap-3 px-12">
            <div className="flex items-center justify-center gap-2 shrink-0 p-[24px_27px]">
              <img
                src="/assets/cart-empty.png"
                alt="Empty Cart"
                className="w-[225px] h-[225px]"
              />
            </div>

            <h3
              className="text-base font-semibold text-center text-black"
              style={{
                color: customization?.selectedTextColor,
              }}
            >
              {t("cart.empytCart")}
            </h3>

            <p
              className="text-[15px] px-10 text-center leading-[19.5px] font-medium text-[#A5A4A8]"
              style={{
                color: customization?.selectedSecondaryColor,
              }}
            >
              {t("cart.empytCartDesc")}
            </p>

            <div className="mt-7 flex flex-col items-center w-[186px] gap-4">
              {orderID && (
                <Link
                  to={`/menu/${restoSlug}/tracking-order?table_id=${table_id}`}
                  className="w-full"
                >
                  <button
                    className="py-4 w-full text-white bg-[#F86A2E] rounded-full text-sm text-center font-medium"
                    style={{
                      background: customization?.selectedPrimaryColor,
                      color: customization?.selectedIconColor,
                    }}
                  >
                    {t("cart.orderProcess")}
                  </button>
                </Link>
              )}

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
                  {t("cart.orderStart")}
                </button>
              </Link>
            </div>
          </div>
        )}

        {!isRestoCartEmpty && (
          <div
            className="px-7 bottom-[105px] fixed left-0 right-0 flex items-center justify-between w-full max-w-md py-4 mx-auto mt-4 -mb-5 bg-white border-t border-gray-200"
            style={{
              background: customization?.selectedBgColor,
              borderColor: hexToRgba(
                customization?.selectedSecondaryColor,
                0.2
              ),
            }}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-medium text-base text-[#8C8E98]"
                  style={{
                    color: customization?.selectedSecondaryColor,
                  }}
                >
                  {t("cart.orderTotal")}
                </span>
                <span
                  className="text-xl font-medium text-[#191D31]"
                  style={{
                    color: customization?.selectedTextColor,
                  }}
                >
                  {totalPrice.toFixed(2)}{" "}
                  <span
                    className="text-[#F86A2E] text-xs font-semibold"
                    style={{
                      color: customization?.selectedPrimaryColor,
                    }}
                  >
                    {currency}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setOpenConfirmModal(true)}
                type="submit"
                className="w-full text-center py-3 font-medium text-white bg-[#F86A2E] rounded-full"
                style={{
                  background: customization?.selectedPrimaryColor,
                  color: customization?.selectedIconColor,
                }}
              >
                {t("common.actions.addToCart")}
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmOrder
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        submitOrder={submitOrder}
        orderPending={orderPending}
      />

      <SuggestedProducts
        isModalOpen={showSuggestedProducts}
        setIsModalOpen={setShowSuggestedProducts}
      />
    </AnimatedLayout>
  );
};

export default Cart;
