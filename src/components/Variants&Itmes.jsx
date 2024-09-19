import { useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MinusIcon, PlusIcon, TrashIcon } from "../constant/page";
import { Button } from '@/components/ui/button';
import { APIURLS3 } from "../lib/ApiKey";
import { incrementQuantity, decrementQuantity, removeItem } from '../lib/cartSlice';

export const ToppingOptions = ({ item }) => {
    // Flatten all options into a single array
    const options = item?.toppings?.length > 0 && item?.toppings?.flatMap(topping =>
      topping.option.map(opt => ({
        name: opt.name,
        price: opt.price,
      })
      )
    )
  
    return (
      <div>
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

export const IngredientsOption = ({ item }) => {
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

export function CartItem({ item, infoRes }) {
  const dispatch = useDispatch();
  const price = parseFloat(item.price);
  const selectedPrices = parseFloat(item.selectedPrices) || 0;
  const quantity = parseInt(item.quantity, 10);

  const subtotal = (price + selectedPrices) * quantity;
  return (
    <div className="grid gap-4">
      <div className=" bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
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
          <div className="flex items-center gap-2">
            <Button onClick={() => dispatch(decrementQuantity(item.id))} size="icon" variant="outline">
              <MinusIcon className="w-4 h-4" />
            </Button>
            <span className="text-base font-medium text-gray-900 dark:text-gray-50">{item.quantity}</span>
            <Button onClick={() => dispatch(incrementQuantity(item.id))} size="icon" variant="outline">
              <PlusIcon className="w-4 h-4" />
            </Button>

          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => dispatch(removeItem(item.id))}
            className="text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

        <ToppingOptions item={item} />
        <ExtraOptions item={item} />
        <IngredientsOption item={item} />
      </div>
    </div>
  );
}