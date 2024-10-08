import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/cartSlice";
import { CheckIcon } from "lucide-react";
import { PlusIcon } from "../constant/page";
import { APIURLS3 } from "../lib/ApiKey";
import { Button } from '@/components/ui/button';
import { AiOutlinePlus } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/components/ui/use-toast"

export function CartItemSuggestionT3({ item, infoRes, customization, resto_id, isDishInCart }) {
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);
  const [initiallyInCart, setInitiallyInCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast()


  // Mise à jour de l'état en fonction de l'élément dans le panier
  useEffect(() => {
    const dishInCart = isDishInCart(item.id);
    setInitiallyInCart(dishInCart);
  }, [item.id, isDishInCart]);

  const handleAddItem = () => {
    dispatch(addItem({
      product: item,
      quantity: quantities,
      resto_id: resto_id,
      comment: "",
      toppings: [],
      ingredients: [],
      extravariants: []
    }));
    setItemQuantity(itemQuantity + 1);
  };


useEffect(() => {
    const dishInCart = isDishInCart(item.id);
    setInitiallyInCart(dishInCart);
  }, [item.id, isDishInCart]);
  const handleClick = () => {
    handleAddItem();
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const image = item?.image1;
  const imageUrl = `${APIURLS3}/${image}`;

  return (
    <div className="tabs-container overflow-x-auto" key={item.id}>
      <div className="flex gap-4">
        <Button onClick={() => setIsModalOpen(!isModalOpen)} className="h-auto w-full !py-0 px-0 bg-transparent hover:bg-transparent">
          <div className="relative rounded-[10px] w-full border-gray-300 border inline-block">
            <div
              onClick={() => setSelectedItem(item)}
              className="tab items-center justify-center h-full w-full overflow-hidden p-1.5 pb-0 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
            >
              <Avatar className="h-32 w-full !rounded-[10px]">
                <AvatarImage src={imageUrl} className="bg-white w-full h-full object-cover" />
                <AvatarFallback className="rounded-[10px]"></AvatarFallback>
              </Avatar>

              <div className='text-black flex flex-col items-start py-1 px-1'>
                <div className="w-full flex flex-row justify-between font-normal text-sm font-sans text-[#2F2F2F]">
                  <div className="flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" fill="none">
                      <path d="M7.08737 0.810734C7.25053 0.313774 7.95354 0.313773 8.1167 0.810734L9.43571 4.82817C9.50873 5.05055 9.71632 5.20089 9.95038 5.20089H14.2067C14.7328 5.20089 14.9501 5.87526 14.5229 6.1824L11.0892 8.65127C10.8974 8.7892 10.8171 9.03557 10.8908 9.26006L12.2046 13.2617C12.3682 13.7598 11.7994 14.1766 11.3737 13.8705L7.91826 11.386C7.72933 11.2501 7.47474 11.2501 7.2858 11.386L3.83033 13.8705C3.40469 14.1766 2.8359 13.7598 2.99943 13.2617L4.31327 9.26006C4.38697 9.03557 4.30667 8.7892 4.11483 8.65127L0.681141 6.1824C0.253976 5.87526 0.47125 5.20089 0.99737 5.20089H5.25369C5.48775 5.20089 5.69534 5.05055 5.76835 4.82817L7.08737 0.810734Z" fill="#F2CF63"/>
                    </svg>
                    <span className="ml-1">5</span>
                  </div>

                  <div className="flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none">
                      <path d="M8.72745 16.4098C12.4866 16.4098 15.534 13.394 15.534 9.67376C15.534 5.95356 12.4866 2.93774 8.72745 2.93774C4.9683 2.93774 1.9209 5.95356 1.9209 9.67376C1.9209 13.394 4.9683 16.4098 8.72745 16.4098Z" fill="#CED3ED"/>
                      <path d="M10.9056 2.39881H6.54941C6.24992 2.39881 6.00488 2.15631 6.00488 1.85993C6.00488 1.56354 6.24992 1.32104 6.54941 1.32104H10.9056C11.2051 1.32104 11.4501 1.56354 11.4501 1.85993C11.4501 2.15631 11.2051 2.39881 10.9056 2.39881ZM8.7275 10.2126C8.42801 10.2126 8.18298 9.97009 8.18298 9.67371V6.17098C8.18298 5.87459 8.42801 5.6321 8.7275 5.6321C9.02699 5.6321 9.27203 5.87459 9.27203 6.17098V9.67371C9.27203 9.97009 9.02699 10.2126 8.7275 10.2126Z" fill="#4257FF"/>
                    </svg>
                    <span className="ml-1">15min</span>
                  </div>
                </div>

                <h2 className="text-[#2F2F2F] font-medium tracking-[-0.42px] text-base font-dm-sans mb-0 mt-1 text-left">
                  {item.name.slice(0, 20)}
                </h2>
                <div className="flex w-full justify-between items-center">
                  <p className="text-xs text-left" style={{ color: "red" }}>{item.price + " " + infoRes?.currency}</p>
                  <button
                    type="button"
                    onClick={handleClick}
                    style={{ backgroundColor: "red" }}
                    className="text-white leading-0 w-[30px] h-[30px] flex items-center justify-center rounded-[8px]"
                  >
                    {isAdded ? (
                    <CheckIcon className="w-4 h-4  text-white" />
                  ) : (
                    <PlusIcon className="w-4 h-4  text-white" />
                  )}
                    {/* <AiOutlinePlus style={{ color: "#ffffff" }} /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

}