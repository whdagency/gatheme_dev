import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/cartSlice";
import { CheckIcon } from "lucide-react";
import { PlusIcon } from "../constant/page";
import { APIURLS3 } from "../lib/ApiKey";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CartItemSuggestion({ item, infoRes, customization, resto_id, isDishInCart }) {
     const dispatch = useDispatch();
     const [quantities, setQuantities] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
     const [itemQuantity, setItemQuantity] = useState(0);
     const [initiallyInCart, setInitiallyInCart] = useState(false);
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
     const handleAddItem = () => {
       dispatch(addItem({ product: item, quantity: quantities, resto_id: resto_id, comment: "", toppings: [], ingredients: [], extravariants: [] }));
       setItemQuantity(itemQuantity + 1);
     };

    // console.log("resInfo ==== ", infoRes);
    // console.log("item  ==== ", item);
    // console.log("customization  ==== ", customization);
    // console.log("resto_id  ==== ", resto_id);

    console.log("isDishInCart  ==== ", isDishInCart);

    




      return (
        <div className="grid gap-1">
          <div className=" dark:bg-gray-800 p-4 rounded-lg">
            <div className='flex flex-col justify-start items-start gap-2'>
              <div className="w-full flex justify-center  relative">
                <Avatar className="h-[110px] w-[110px]  rounded-xl">
                    <AvatarImage
                        src={`${APIURLS3}/${item.image1}`}
                        style={{
                        aspectRatio: '150/150',
                        objectFit: 'cover',
                        }}
                        className="bg-white w-full h-auto rounded-xl  object-cover"
                    />
                    <AvatarFallback className="bg-slate-200 rounded-xl"></AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleClick}
                  style={{ backgroundColor: customization?.selectedPrimaryColor }}
                  className={`transition-transform h-8 w-8 absolute bottom-0 right-5 ${isAdded ? 'scale-110' : ''}`}
                >
                  {isAdded ? (
                    <CheckIcon className="w-4 h-4  text-white" />
                  ) : (
                    <PlusIcon className="w-4 h-4  text-white" />
                  )}
                </Button>
              </div>
    
              <div className="flex flex-col items-center text-center self-center ">
                <div className='text-center'>
                  <p className=" font-medium -900 text-sm  dark:text-gray-50">{item.name}</p>
                  <h3 className=" text-gray-700 font-semibold text-base dark:text-gray-400 mb-1">{item.price + " " + infoRes.currency}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

  }
  