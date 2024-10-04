import { CheckIcon, PlusIcon } from "lucide-react";
import React from "react";
import { Credenza, CredenzaContent } from "@/components/ui/credenza";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";

const SuggestedProducts = ({ isModalOpen, setIsModalOpen }) => {
  const { resInfo, customization, resto_id, products } = useMenu();

  return (
    <Credenza
      className="!bg-white  !py-0"
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <CredenzaContent className="flex max-h-[70%]  md:w-[50rem] bg-white md:flex-col md:justify-center md:items-center">
        <div className="mt-10 mb-1 text-lg font-semibold text-center text-black">
          Suggested Products
        </div>
        <div className=" grid grid-cols-2 gap-0 p-2 mb-3">
          {products?.slice(0, 4).map((item, index) => (
            <CartItemSuggestion
              key={index}
              item={item}
              infoRes={resInfo}
              customization={customization}
              resto_id={resto_id}
            />
          ))}
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

export default SuggestedProducts;

const CartItemSuggestion = ({ item, infoRes, customization, resto_id }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);

  const handleClick = () => {
    handleAddItem();
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleAddItem = () => {
    setItemQuantity(itemQuantity + 1);
  };

  return (
    <div className="grid gap-1">
      <div className=" dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-28 relative flex justify-center">
            <img
              alt={item.name}
              className=" rounded-xl object-cover"
              height={150}
              src={`${STORAGE_URL}/${item.image1}`}
              style={{
                aspectRatio: "150/150",
                objectFit: "cover",
              }}
              width={150}
            />
            {itemQuantity > 0 && (
              <div
                className="absolute top-0 left-0 flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-full"
                style={{ fontSize: 12 }}
              >
                {itemQuantity}
              </div>
            )}
            <button
              onClick={handleClick}
              style={{ backgroundColor: customization?.selectedPrimaryColor }}
              className={`transition-transform h-8 w-8 absolute bottom-0 right-0 ${
                isAdded ? "scale-110" : ""
              }`}
            >
              {isAdded ? (
                <CheckIcon className="w-4 h-4 text-white" />
              ) : (
                <PlusIcon className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <div className=" flex flex-col self-start ml-6">
            <div className="text-left">
              <p className=" -900 dark:text-gray-50 text-sm font-medium">
                {item.name}
              </p>
              <h3 className=" dark:text-gray-400 mb-1 text-base font-semibold text-gray-700">
                {item.price + " " + infoRes.currency}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
