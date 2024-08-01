import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { useTranslation } from "react-i18next";

import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/cartSlice";
import { FiMinus, FiPlus } from "react-icons/fi";

const ThemeDishes = ({ category, dishes }) => {
  const { resInfo, customization } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  return (
    <>
      <AccordionItem value={category.id} className="border-0">
        <AccordionTrigger
          style={{
            backgroundColor: customization?.selectedPrimaryColor,
            color: customization?.selectedBgColor,
          }}
          className="hover:bg-black hover:no-underline flex flex-row items-center justify-between w-full px-3 py-2 text-white uppercase bg-black border-0 rounded"
        >
          {category.name}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4 pt-4 border-0">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => {
                setSelectedItem(dish);
                setIsModalOpen(true);
              }}
              className="hover:bg-black/5 flex flex-col gap-2 p-2 cursor-pointer"
            >
              <div
                style={{
                  color: customization.selectedPrimaryColor,
                  borderColor: customization.selectedPrimaryColor,
                }}
                className="border-b-black/40 last:border-b-0 flex items-center justify-between border-b"
              >
                <h3 className="font-bold">{dish.name}</h3>
                <p className="font-bold">
                  {dish.price} {resInfo.currency || "MAD"}
                </p>
              </div>

              <p
                style={{ color: customization.selectedSecondaryColor }}
                className="text-sm font-light leading-relaxed"
              >
                {dish.desc}
              </p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AddDishToCart
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default ThemeDishes;

const AddDishToCart = ({ isModalOpen, setIsModalOpen, selectedItem }) => {
  const { resInfo, customization, resto_id } = useMenu();
  const [quantities, setQuantities] = useState({});
  const [addToCartClicked, setAddToCartClicked] = useState(false);
  const [comment, setComment] = useState("");
  const { t, i18n } = useTranslation("global");

  const dispatch = useDispatch();

  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;

  // Set quantity
  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
  };

  // Add item to cart
  const handleAddItem = (product, quantity) => {
    dispatch(
      addItem({
        product,
        quantity: quantity,
        resto_id: resto_id,
        comment: comment,
      })
    );

    setComment("");

    setIsModalOpen(false);
  };

  return (
    <Credenza
      className={"!bg-white !py-0"}
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        setComment("");
      }}
    >
      <CredenzaContent className="flex flex-col md:w-[50rem] md:justify-center">
        {selectedItem != null && (
          <>
            <CredenzaBody className="sm:pb-0 flex flex-col items-center gap-4 mt-5 text-center">
              <CredenzaTitle
                style={{ color: customization.selectedPrimaryColor }}
                className="text-2xl font-bold"
              >
                {selectedItem.name}
              </CredenzaTitle>

              <p
                style={{ color: customization.selectedSecondaryColor }}
                className="text-neutral-400 flex items-center justify-center w-full m-0 text-base font-normal text-center"
              >
                {selectedItem?.desc}
              </p>

              <div className="flex flex-col w-full gap-2 px-5">
                <h3 className="text-start px-2 text-lg font-bold text-black">
                {t('menuAddItem.addnote')}

                </h3>
                <textarea
                  name="note"
                  id="now"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder={t('menuAddItem.commentPlaceholder')}
                  className="border-[#E5E7EB] focus:outline-none focus:border-[#E5E7EB] text-black/90 w-full h-24 px-2 py-1  border rounded-md font-[Inter] shadow font-light"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                ></textarea>
              </div>

              <div className="px-7 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) - 1
                      )
                    }
                    className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded"
                  >
                    <FiMinus
                      size={15}
                      className="text-[#37392C]"
                      // color={customization?.selectedPrimaryColor}
                    />
                  </button>

                  <p
                    style={{ color: customization?.selectedTextColor }}
                    className="text-2xl"
                  >
                    {getQuantity(selectedItem.id)}
                  </p>

                  <button
                    onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) + 1
                      )
                    }
                    className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded"
                  >
                    <FiPlus
                      size={15}
                      className="text-[#37392C]"
                      // color={customization?.selectedPrimaryColor}
                    />
                  </button>
                </div>

                <span
                  className="text-2xl font-bold"
                  style={{ color: customization?.selectedPrimaryColor }}
                >
                  {selectedItem.price + " " + resInfo?.currency}
                </span>
              </div>
            </CredenzaBody>

            <CredenzaFooter className="md:justify-center px-9 grid items-center w-full mt-2">
              <button
                type="button"
                onClick={() => {
                  handleAddItem(selectedItem, getQuantity(selectedItem.id));
                  setAddToCartClicked(true);
                  setTimeout(() => {
                    setAddToCartClicked(false);
                  }, 1000);
                }}
                className={`rounded-md p-2 transition-all duration-300 border font-normal text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                  color: customization?.selectedBgColor,
                }}
              >
                <div
                  className={`text-lg font-normal ${
                    addToCartClicked ? "text-primary-blue" : "text-white"
                  } `}
                >
                  {addToCartClicked
                    ? "Added To Your Cart"
                    : `${t('menuAddItem.addToSelected')}
: ${
                        (
                          selectedItem.price * getQuantity(selectedItem.id)
                        ).toFixed(2) +
                        " " +
                        `${resInfo?.currency ?? "MAD"}`
                      }`}
                </div>
              </button>

              <CredenzaClose
                asChild
                className="w-fit md:w-full pb-10 mx-auto mt-4"
              >
                <button className="text-sm text-center text-gray-400">
                  {t('menuAddItem.close')}
                </button>
              </CredenzaClose>
            </CredenzaFooter>
          </>
        )}
      </CredenzaContent>
    </Credenza>
  );
};

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}