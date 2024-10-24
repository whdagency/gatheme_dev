import { useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MinusIcon, PlusIcon, TrashIcon } from "../constant/page";
import { Button } from '@/components/ui/button';
import { APIURLS3 } from "../lib/ApiKey";
import { incrementQuantity, decrementQuantity, removeItem } from '../lib/cartSlice';
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";



 export const ToppingOptions = ({ item }) => {
//     // Flatten all options into a single array
     const options = item?.toppings?.length > 0 && item?.toppings?.flatMap(topping =>
       topping.option.map(opt => ({
         name: opt.name,
         price: opt.price,
       })
       )
     )
  
     return (
       <div className="">
         {options?.length > 0 && (
           <div className="text-md mt-4">
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

   export const ExtraOptions = ({ item }) => {
     // Flatten all options into a single array
     const options = item?.extravariants?.length > 0 && item?.extravariants?.flatMap(topping =>
       topping.option.map(opt => ({
         name: opt.name,
         price: opt.price,
       }))
     );
     return (
       <div className="">
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

 export const IngredientsOption = ({ item }) => {
   // Directly use the ingredients array
   const ingredients = item?.ingredients ?? [];
   // console.log("ingredients == ", ingredients);
   return (
     <div className="">
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

 export function CartItem({ item, infoRes }) {
   const dispatch = useDispatch();
   const price = parseFloat(item.current_price);
   const selectedPrices = parseFloat(item.selectedPrices) || 0;
   const quantity = parseInt(item.quantity, 10);
   const [showChevrondown, setshowChevrondown] = useState(false);


  //  console.log("item =============  ", item);
  //  console.log("item quantity =============  ", item.quantity);
   const subtotal = (price + selectedPrices) * quantity;
   // console.log("ingiridiant length ==== ", item.ingredients.length);
   // console.log("extravariant length ==== ",item?.extravariants?.length);
   // console.log("topping lenght ==== ",item?.toppings?.length);
   return (
     <div className="grid gap-4 ">
       <div className="   p-4  ">
         <div className='flex items-center gap-2'>
           <div className="w-16 h-16 rounded-md overflow-hidden">
  <Avatar className="h-full w-full  rounded-[10px]">
                 <AvatarImage
                     src={`${APIURLS3}/${item.image1}`}
                     style={{
                       aspectRatio: '64/64',
                       objectFit: 'cover',
                     }}
                     className="bg-white w-full h-auto rounded-md  object-cover"
                 />
               <AvatarFallback className="bg-slate-200 rounded-[10px]"></AvatarFallback>
             </Avatar>
           </div>
           <div className="flex-1">
             <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">{item.name}</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm">{subtotal.toFixed(2) + " " + infoRes.currency}</p>
             <span className="text-[12px] font-medium text-gray-900 dark:text-gray-50">{item?.comment?.length > 15 ? item?.comment?.slice(0, 10) + '...' : item?.comment}</span>
           </div>
           <div className="flex flex-col justify-around gap-4">
             <div className="flex justify-end items-center "
                 onClick={() => dispatch(removeItem(item.id))}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path d="M3.5 3.5L12.5 12.5" stroke="#A6ADB4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M3.5 12.5L12.5 3.5" stroke="#A6ADB4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
             </div>
             <div className="flex bg-[#FF9C96] border-2 border-[#DB281C] rounded-full items-center gap-2">
               <Button onClick={() => dispatch(decrementQuantity(item.id))} size="icon" variant="outline" className="rounded-full w-[21px] h-[21px] bg-[#DB281C] mx-1">
                 <MinusIcon className="w-4 h-4" style={{color: "white"}}/>
               </Button>
               <span className="text-base font-medium text-gray-900 dark:text-gray-50">{item.quantity}</span>
               <Button onClick={() => dispatch(incrementQuantity(item.id))} size="icon" variant="outline" className="rounded-full w-[21px] h-[21px] bg-[#DB281C] mx-1">
                 <PlusIcon className="w-4 h-4" style={{color: "white"}} />
               </Button>
             </div>

           </div>
          
         </div>
          
           {item.ingredients.length > 0 && item?.extravariants?.length &&  item?.toppings?.length && (

             <div className="flex flex-col mt-2  ">
                 <div className="flex justify-between items-center " onClick={() => setshowChevrondown(!showChevrondown)}>
                   <h2>Order Details</h2>
                   {showChevrondown ? (
                       <FaChevronDown />
                     ) : (
                       <FaChevronRight />
                     )}
                 </div>
                   {showChevrondown && (
                       <div>
                           <ToppingOptions item={item} />
                           <ExtraOptions item={item}  />
                           <IngredientsOption item={item} />
                       </div>
                   )}
             </div>
           )
           }
       </div>
     </div>
   );
 }

