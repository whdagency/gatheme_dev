import { X, Minus, Plus } from "lucide-react";
import { useCart } from "react-use-cart";
import { STORAGE_URL } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const CartItem = ({
  image,
  title,
  price,
  currency,
  id,
  removeItem,
  quantity,
  item,
}) => {
  const { updateItem: updateCartItem } = useCart();

  const updateItem = (value) => {
    const originalProductTotal = parseFloat(
      item?.productTotal || item.price * item.quantity
    );

    const newTotal =
      value > 0
        ? originalProductTotal + parseFloat(item.price)
        : originalProductTotal - parseFloat(item.price);

    updateCartItem(item.id, {
      ...item,
      quantity: item.quantity + value,
      productTotal: parseFloat(newTotal).toFixed(2),
    });
  };

  const handleRemove = () => {
    removeItem();
  };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <img
          src={
            image.includes("default_images") ? "" : `${STORAGE_URL}/${image}`
          }
          alt={title}
          className="rounded-2xl object-cover w-20 h-20 shadow-sm"
          onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
        />

        <div className="flex items-center justify-between flex-1">
          <div className="flex flex-col items-start justify-between gap-5">
            <h3 className="md:text-base text-sm font-semibold text-black capitalize">
              {title}
            </h3>

            <span className="text-base font-medium text-black">
              {price}{" "}
              <span className="text-xs text-[#F86A2F] font-medium">
                {currency}
              </span>
            </span>
          </div>

          <div className="shrink-0 flex flex-col items-end self-end justify-end gap-5">
            <X
              color={"#A6ADB4"}
              className="w-5 h-5 cursor-pointer"
              onClick={handleRemove}
            />

            <div className="flex items-center p-[4.372px] bg-[#EAEAEA] rounded-full">
              <button
                type="button"
                onClick={() => updateItem(-1)}
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full"
              >
                <Minus size={20} color="black" />
              </button>
              <span className="font-rs-text-semibold mx-3">{quantity}</span>
              <button
                type="button"
                onClick={() => updateItem(1)}
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full"
              >
                <Plus size={20} color="black" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartItem;