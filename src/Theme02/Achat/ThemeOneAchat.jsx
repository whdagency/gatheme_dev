import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useMenu } from "../../hooks/useMenu";
import { useTranslation } from "react-i18next";

import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
  removeAll,
} from "../../lib/cartSlice";
import { APIURL } from "../../lib/ApiKey";
import "./Achat.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const ThemeOneAchat = ({ activeLink }) => {
  // restaurant menu data
  const { customization, restos, resInfo, table_id } = useMenu();
  const resto_id = restos.id;

  // use state
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [pending, setPending] = useState(false);

  // redux state and dispatch
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // order functions
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const submitOrder = async (cartItems, totalCost) => {
    setPending(true);

    let cartItemProduct = cartItems.map((item) => ({
      type: item.type, // Assuming all items are dishes
      id: item.id,
      quantity: item.quantity,
      comment: item.comment || "",
    }));

    const order = {
      total: totalCost,
      status: "New",
      table_id: table_id,
      resto_id: resto_id,
      cartItems: cartItemProduct,
    };

    console.log("The order is ", order);

    try {
      const response = await fetch(`${APIURL}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorResponse}`);
      }

      const responseData = await response.json();
      console.log("Order submitted:", order, cartItemProduct, responseData);
      if (response) {
        const notification = {
          title: "New Order",
          status: "Order",
          resto_id: resto_id,
          table_id: table_id,
        };

        const formData = new FormData();
        formData.append("title", "New Order");
        formData.append("status", "Order");
        formData.append("resto_id", resto_id);

        const responseNotification = await fetch(
          `${APIURL}/api/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notification),
          }
        );

        console.log("Nice => ", responseNotification);
        setPending(false);
        setOrderSuccessModalOpen(true);
        dispatch(removeAll());
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      setPending(false);
      console.error("Failed to submit order:", error.message);
    }
  };
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <Sheet>
      <SheetTrigger>
      <p className="relative">
  <FiShoppingBag
    size={25}
    color={customization?.selectedPrimaryColor}
  />
  <span
    style={{
      backgroundColor: customization?.selectedPrimaryColor,
      color: customization?.selectedBgColor,
    }}
    className="absolute -right-1.5 -top-1 size-5 grid place-content-center rounded-full text-[10px] leading-3"
  >
    {totalItems}
  </span>
</p>
      </SheetTrigger>

      <SheetContent
        id="hide"
        className="scrollbar-hide w-full overflow-y-scroll"
      >
        <div className="dark:bg-gray-950 bg-white">
          <div className="relative flex items-center justify-between">
            <h1 className="text-lg font-bold text-black uppercase">
              {restos.name || "Garista"}
            </h1>

            <SheetClose>
              <img
                src="/assets/close.svg"
                alt="close button"
                className="w-7 h-7 absolute top-0 right-0"
              />
            </SheetClose>
          </div>

          <section className="relative flex flex-col min-h-screen gap-4 pt-5 pb-40">
            {" "}
            {/* Added padding-bottom */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-400">
              <div className="flex items-center gap-2">
                <h2 className="dark:text-gray-50 text-primary-text text-2xl font-bold">
                  {t('achat.shoppingCart')}
                </h2>

                <div className="w-[1px] h-7 bg-gray-500" />

                <span className="text-lg font-normal">
                  {cartItems.length} {cartItems.length === 1 ? <>{t('achat.item')}</> : <>{t('achat.items')}</>}
                </span>
              </div>

              <Button
                variant="link"
                disabled={pending || cartItems.length === 0}
                className={
                  pending
                    ? "text-black cursor-not-allowed"
                    : "text-primary-text"
                }
                onClick={() => dispatch(removeAll())}
              >
                {t('achat.clearBtn')}
              </Button>
            </div>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5">
                <img
                  src="/assets/empty-cart.png"
                  alt="empty-cart"
                  className="object-contain w-[234px] h-[233px] mx-auto"
                />

                <p className="mt-2 text-2xl font-bold text-center text-gray-900">
                  {t('achat.empty')}
                </p>

                <p className="text-black/50 mt-2 text-lg text-center">
                  {/* Looks like you haven&apos;t made your choice yet... */}
                  {t('achat.checkout')}
                </p>

                <SheetClose className="flex items-center justify-center mt-2 text-center">
                  <p className="text-sm flex item-center gap-2 font-bold text-[#875F45]">
                    <Plus size={18} className="text-[#875F45]" />
                    <span>{t('achat.addmoreitems')}</span>
                  </p>
                </SheetClose>
              </div>
            ) : (
              <>
                <div className="gap-7 flex flex-col w-full pt-5 mb-auto">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} infoRes={resInfo} />
                  ))}

                  <SheetClose>
                    <p className="text-sm flex item-center gap-2 font-bold text-[#875F45]">
                      <Plus size={18} className="text-[#875F45]" />
                      <span>{t('achat.addmoreitems')}</span>
                    </p>
                  </SheetClose>
                </div>
              </>
            )}
          </section>

          <div className="md:max-w-sm md:ms-auto md:pb-5 fixed bottom-0 left-0 right-0 z-10 w-full px-6 pt-5 pb-8 bg-white">
            {" "}
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                submitOrder(cartItems, totalCost);
              }}
              className="flex flex-col w-full gap-8 mx-auto"
            >
              {/* Total & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t-gray-400 flex flex-col gap-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-xl font-bold text-black">
                    <p className="uppercase">{t('achat.total')}</p>
                    <p>{`${totalCost.toFixed(2)} ${resInfo?.currency}`}</p>
                  </div>
                </div>
              )}

              <Button
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                  opacity: cartItems.length > 0 ? 1 : 0.2,
                  color: customization?.selectedBgColor,
                }}
                className={`w-full px-4 py-2 font-semibold text-white rounded-lg ${cartItems.length === 0 ? "cursor-default" : ""}`}
                size="lg"
                disabled={pending || cartItems.length === 0}
              >
                {pending ? (
                  <ClipLoader
                    color={customization?.selectedIconColor}
                    visible={pending}
                    size={25}
                  />
                ) : (
                  <>{t('achat.checkoutBtn')}</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>

      <CartSuccessModal
        open={orderSuccessModalOpen}
        setOpen={setOrderSuccessModalOpen}
      />
    </Sheet>
  );
};

export default ThemeOneAchat;

// cart item render component
const CartItem = ({ item, infoRes }) => {
  const dispatch = useDispatch();
  const { customization } = useMenu();

  return (
    <div className="last:border-b-0 grid gap-4 border-b border-[#C2C2C2] pb-3">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-start justify-between gap-4">
          <p className="text-start flex items-center w-1/2 col-span-1 gap-2 font-medium">
            <span className="text-primary-text text-[15px] font-bold">
              {item.name}
            </span>
          </p>

          <div className="flex items-center justify-between w-1/3 col-span-1 gap-2">
            <button
              onClick={() => dispatch(decrementQuantity(item.id))}
              className="hover:bg-gray-200 flex items-center justify-between p-1 bg-gray-100 rounded"
            >
              <FiMinus size={12} className="text-gray-700" />
            </button>

            <p
              style={{ color: customization?.selectedTextColor }}
              className="text-base"
            >
              {item.quantity}
            </p>

            <button
              onClick={() => dispatch(incrementQuantity(item.id))}
              className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded"
            >
              <FiPlus size={12} className="text-gray-700" />
            </button>
          </div>

          <div className="flex items-center justify-end w-1/2 col-span-1 gap-2">
            <p className="text-xs font-semibold text-black font-[Inter]">
              {parseFloat(item.price * item.quantity).toFixed(2)}{" "}
              {infoRes?.currency}
            </p>

            <button onClick={() => dispatch(removeItem(item.id))}>
              <FiTrash size={12} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// cart success modal
export const CartSuccessModal = ({ open, setOpen }) => {
  const { customization } = useMenu();
  const { t, i18n } = useTranslation("global");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[80%] rounded-lg md:max-w-sm">
        <AlertDialogHeader className="flex flex-col gap-5">
          <AlertDialogTitle className="flex items-center justify-center">
            <img
              src="/assets/confirm-order.svg"
              alt="confirm-order"
              className="object-contain w-[180px] h-[120px] mx-auto"
            />
          </AlertDialogTitle>

          <AlertDialogDescription className="flex flex-col items-center gap-3 text-center">
            <h2
              style={{ color: customization?.selectedPrimaryColor }}
              className="text-2xl font-bold text-center text-black"
            >
             {t('achat.preparedorder')}
            </h2>

            <span className="text-sm font-normal text-gray-500">
             {t('achat.thanksalert')}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            autoFocus
            onClick={() => setOpen(false)}
            style={{
              backgroundColor: customization?.selectedPrimaryColor,
              color: customization?.selectedBgColor,
            }}
            className="flex items-center justify-center w-full gap-2 mx-auto font-normal text-center text-white"
          >
            {t('menu.ok')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};