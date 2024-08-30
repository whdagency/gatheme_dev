import React, { useEffect, useState } from "react";
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
import StepsBar from "./stepsv2";
// import { ref, database, onValue, } from "firebase/database";

import { database, onValue, ref } from '../../firebaseConfig';
import { axiosInstance } from "../../axiosInstance";

const ThemeOneAchat = ({ activeLink }) => {
  // restaurant menu data
  const { customization, restos, resInfo, table_id, tableName } = useMenu();
  const resto_id = restos.id;

  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  // use state
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const [status, setStatus] = useState("")
  // const [orderID, setOrderID] = useState("");
  // redux state and dispatch
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  console.log("im cart ", cartItems);


  // order functions
  const totalCost = cartItems.reduce((total, item) => {
    // Convert item.price to a number, defaulting to 0 if it's not a valid number
    const itemPrice = parseFloat(item.price) || 0;

    // Check the type and value of item.selectedPrices
    let selectedPrices = 0;
    if (Array.isArray(item.selectedPrices)) {
      // If it's an array, sum up all the prices
      selectedPrices = item.selectedPrices.reduce((sum, price) => {
        const parsedPrice = parseFloat(price);
        return sum + (isNaN(parsedPrice) ? 0 : parsedPrice);
      }, 0);
    } else if (typeof item.selectedPrices === 'string') {
      // If it's a string, convert it to a number
      selectedPrices = parseFloat(item.selectedPrices) || 0;
    } else {
      // Handle other cases (e.g., object, null, etc.)
      console.warn('Unexpected value for selectedPrices:', item.selectedPrices);
    }

    // Calculate the total cost for this item
    const itemTotal = (itemPrice + selectedPrices) * (item.quantity || 0);

    // Log the calculated total for debugging
    console.log("Item price:", itemPrice);
    console.log("Selected prices:", selectedPrices);
    console.log("Item total:", itemTotal);

    // Accumulate the total cost
    return total + itemTotal;
  }, 0);


  // const submitOrder = async (cartItems, totalCost) => {
  //   setPending(true);

  //   let cartItemProduct = cartItems.map((item) => ({
  //     type: item.type, // Assuming all items are dishes
  //     id: item.id,
  //     quantity: item.quantity,
  //     comment: item.comment || "",
  //   }));

  //   const order = {
  //     total: totalCost,
  //     status: "New",
  //     table_id: table_id,
  //     resto_id: resto_id,
  //     cartItems: cartItemProduct,
  //   };

  //   console.log("The order is ", order);

  //   try {
  //     const response = await fetch(`${APIURL}/api/order`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(order),
  //     });

  //     if (!response.ok) {
  //       const errorResponse = await response.text();
  //       throw new Error(`HTTP error ${response.status}: ${errorResponse}`);
  //     }

  //     const responseData = await response.json();
  //     console.log("Order submitted:", order, cartItemProduct, responseData);
  //     if (response) {
  //       const notification = {
  //         title: "New Order",
  //         status: "Order",
  //         resto_id: resto_id,
  //         table_id: table_id,
  //       };

  //       const formData = new FormData();
  //       formData.append("title", "New Order");
  //       formData.append("status", "Order");
  //       formData.append("resto_id", resto_id);

  //       const responseNotification = await fetch(
  //         `${APIURL}/api/notifications`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(notification),
  //         }
  //       );

  //       console.log("Nice => ", responseNotification);
  //       setPending(false);
  //       setOrderSuccessModalOpen(true);
  //       dispatch(removeAll());
  //     }
  //     // Handle post-order submission logic here, like clearing the cart or redirecting the user
  //   } catch (error) {
  //     setPending(false);
  //     console.error("Failed to submit order:", error.message);
  //   }
  // };

  const fetchValues = async () => {
    try {
      // const response = await axiosInstance.get('/api/suggestions/'+resto_id);

      // const suggestions = response.data;

      // // // Extract dishes from suggestions
      // const initialSelectedDishes = suggestions
      // .filter(suggestion => suggestion.dishes) // Only take suggestions with dishes
      // .map(suggestion => suggestion.dishes);

      // const initialSelectedDrinks = suggestions
      // .filter(suggestion => suggestion.drinks) // Only take suggestions with dishes
      // .map(suggestion => suggestion.drinks);

      // // const ComindeSelected = [...initialSelectedDishes, ...initialSelectedDrinks]
      // let ComindeSelected = [];
      // if (initialSelectedDishes.length) {
      //   ComindeSelected.push(...initialSelectedDishes.map(item => ({ ...item, type: 'dish' })));
      // }
      // if (initialSelectedDrinks.length) {
      //   ComindeSelected.push(...initialSelectedDrinks.map(item => ({ ...item, type: 'drink' })));
      // }
      // const filteredSuggestions = ComindeSelected.filter(suggestion => {
      //   return !cartItems.some(cartItem => cartItem.id === suggestion.id && cartItem.type === suggestion.type);
      // });
      // setSelectedDishes(filteredSuggestions);

      const res = localStorage.getItem('orderID');
      setOrderID(res)
      const result = await axiosInstance.get('/api/orders/' + res)
      console.log("The Response of RestoInfo => ", resto_id);
      const data = result?.data?.order
      if (result) {

        setStatus(data?.status)
        if (data?.status == "new") {
          setCurrentStep(1);
          setComplete(false)
        }
        else if (data?.status == "Processing") {
          setCurrentStep(2)
          setComplete(false)
        }
        else if (data?.status == "Completed") {
          setCurrentStep(4);
          setComplete(true);
          localStorage.setItem('orderID', null)
        }
        else if (data?.status == "Canceled") {
          setCurrentStep(3);
          setCanceled(true);
          localStorage.setItem('orderID', null)
        }
      }

    }
    catch (err) {
      console.log("The Error => ", err);
    }
  }

  const subscribeToFirebase = () => {
    const ordersRef = ref(database, "orders");
    onValue(ordersRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        fetchValues()
      }
    });
  };



  useEffect(() => {
    fetchValues();
    subscribeToFirebase()
  }, [])
  const submitOrder = async (cartItems, totalCost) => {
    setPending(true);
    sessionStorage.setItem('modalOpened', '');
    let cartItemProduct = cartItems.map(item => ({
      type: item.type,  // Assuming all items are dishes
      id: item.id,
      quantity: item.quantity,
      comment: item.comment ? item.comment : null,
      toppings: item.toppings,
      ingrediants: item.ingredients,
      extraVariant: item.extravariants
    })

    );

    const order = {
      total: totalCost,
      status: 'New',
      table_id: extraInfo,  // Assuming static for now, you may need to adjust this based on your app's logic
      resto_id: resto_id,   // Assuming static as well, adjust accordingly
      cartItems: cartItemProduct
    };
    try {
      const response = await fetch(`https://backend.garista.com/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorResponse}`);
      }

      const responseData = await response.json();
      console.log('Order submitted:', responseData?.order?.id);
      localStorage.setItem('orderID', JSON.stringify(responseData?.order?.id))
      const id = JSON.stringify(responseData?.order?.id)

      if (response) {
        const notification = {
          title: "New Order",
          status: "Order",
          resto_id: resto_id,
          table_id: extraInfo,
        };
        const formData = new FormData();
        formData.append("title", "New Order");
        formData.append("status", "Order");
        formData.append("resto_id", resto_id);
        const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });

        console.log("Nice => ", responseNotification);
        setPending(false);
        setOrderSuccessModalOpen(false);
        setOrderID(id)
        dispatch(removeAll())
      }

    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
    // setOrderSubmitted(true);
  };


  const { t, i18n } = useTranslation("global");
  const [orderID, setOrderID] = useState("");
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
              {restos.name || "Garista"} <span className="text-xs text-muted-foreground capitalize font-normal"> Table: {tableName}</span>
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
            <div className="flex flex-col justify-center ">
              {orderID != 'null' &&
                <StepsBar
                  status={status}
                  orderID={orderID}
                  currentStep={currentStep}
                  infoRes={resInfo}
                  complete={complete}
                  cartItems={cartItems}
                  totalCost={totalCost}
                  canceled={canceled}
                />
              }
            </div>

            {/* Added padding-bottom */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-400">
              <div className="flex items-center gap-2">
                <h2 className="dark:text-gray-50 text-primary-text text-lg font-bold">
                  {t('achat.shoppingCart')}
                </h2>

                <div className="w-[1px] h-7 bg-gray-500" />

                <span className="text-base text-muted-foreground font-normal">
                  {cartItems.length} {cartItems.length === 1 ? <>{t('achat.item')}</> : <>{t('achat.items')}</>}
                </span>
              </div>

              <Button
                variant="link"
                disabled={pending || cartItems.length === 0}
                className={
                  pending
                    ? "text-black cursor-not-allowed px-0"
                    : "text-primary-text px-0"
                }
                onClick={() => dispatch(removeAll())}
              >
                {t('achat.clearBtn')}
              </Button>
            </div>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center my-auto justify-center gap-5">
                <img
                  src="/assets/empty-cart.png"
                  alt="empty-cart"
                  className="object-contain w-[234px] h-[233px] mx-auto"
                />
                <div>
                  <p className="mt-2 text-3xl font-bold capitalize text-center text-gray-900">
                    {t('achat.empty')}
                  </p>

                  <p className="text-black/50 mt-2 text-lg text-center">
                    {/* Looks like you haven&apos;t made your choice yet... */}
                    {t('achat.checkout')}
                  </p>
                </div>


                <SheetClose className="flex capitalize items-center justify-center mt-2 text-center">
                  <p className="text-sm flex item-center gap-2 font-bold text-[#875F45]">
                    <Plus size={18} className="text-[#875F45]" />
                    <span>{t('achat.addmoreitems')}</span>
                  </p>
                </SheetClose>
              </div>
            ) : (
              <>
                <div className="gap-4 flex flex-col w-full pt-2 mb-auto">
                  {cartItems.map((item) => (
                    <>
                      <CartItem key={item.id} item={item} infoRes={resInfo} />

                    </>
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

          <div className="md:max-w-sm md:ms-auto md:pb-5 fixed bottom-0 left-0 right-0 z-10 w-full px-4 pt-5 pb-5 bg-white">
            {" "}
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                submitOrder(cartItems, totalCost);
              }}
              className="flex flex-col w-full gap-4 mx-auto"
            >
              {/* Total & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t-gray-400 flex flex-col gap-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-base px-1 font-bold text-black">
                    <p className="capitalize">{t('achat.total')}</p>
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


const ToppingOptions = ({ item }) => {
  // Flatten all options into a single array
  const options = item?.toppings?.length > 0 && item?.toppings?.flatMap(topping =>
    topping.option.map(opt => ({
      name: opt.name,
      price: opt.price,
    }))
  );
  return (
    <div>
      {options?.length > 0 && (
        <div className="text-md mt-3">
          {options.map((opt, index) => (
            <span key={opt.name} className='text-gray-400 !font-[300] text-[14px]'>
              {opt.name}
              {index < options.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
const ExtraOptions = ({ item }) => {
  // Flatten all options into a single array
  const options = item?.extravariants?.length > 0 && item?.extravariants?.flatMap(topping =>
    topping.option.map(opt => ({
      name: opt.name,
      price: opt.price,
    }))
  );
  return (
    <div>
      {options?.length > 0 && (
        <div className="text-md">
          {options.map((opt, index) => (
            <span key={opt.name} className='text-gray-400 !font-[300] text-[14px]'>
              {opt.name}
              {index < options.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
const IngredientsOption = ({ item }) => {
  // Directly use the ingredients array
  const ingredients = item?.ingredients ?? [];
  return (
    <div>
      {ingredients.length > 0 && (
        <div className="text-md">
          {ingredients.map((ingredient, index) => (
            <span key={ingredient.name} className='text-gray-400 !font-[300] text-[14px]'>
              {ingredient.name}
              {index < ingredients.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
// cart item render component
const CartItem = ({ item, infoRes }) => {
  const dispatch = useDispatch();
  const { customization } = useMenu();
  const price = parseFloat(item.price);
  const selectedPrices = parseFloat(item.selectedPrices) || 0;
  const quantity = parseInt(item.quantity, 10);
  const subtotal = (price + selectedPrices) * quantity;
  return (
    <div className="last:border-b-0 grid gap-4 border-b border-[#C2C2C2] pb-3">
      <div className="flex flex-col">
        <div className="flex  items-center justify-between gap-4">
          <p className="text-start w-1/3 flex items-center  col-span-1 gap-2 font-medium">
            <span className="text-primary-text text-[15px] text-nowrap font-bold">
              {item.name}
            </span>
          </p>

          <div className="flex items-center justify-between col-span-1 gap-2">
            <button
              onClick={() => dispatch(decrementQuantity(item.id))}
              className="hover:bg-gray-200 flex items-center justify-between p-1 bg-gray-100 rounded"
            >
              <FiMinus size={20} className="text-gray-700" />
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
              <FiPlus size={20} className="text-gray-700" />
            </button>
          </div>

          <div className="flex items-center w-1/3 justify-end col-span-1 gap-2">
            <p className="text-xs font-semibold text-black text-nowrap font-[Inter]">
              {subtotal.toFixed(2) + " " + infoRes.currency}
            </p>

            <button onClick={() => dispatch(removeItem(item.id))}>
              <FiTrash size={20} className="text-red-500" />
            </button>

          </div>

        </div>

        <span className="text-[12px] font-medium text-gray-900 dark:text-gray-50">{item?.comment?.length > 15 ? item?.comment?.slice(0, 10) + '...' : item?.comment}</span>
        <ToppingOptions item={item} />
        <ExtraOptions item={item} />
        <IngredientsOption item={item} />
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