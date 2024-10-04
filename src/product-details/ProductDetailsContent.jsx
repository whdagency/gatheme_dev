import React, { useState, useCallback, useMemo } from "react";
import { Minus, Plus, Check, X, Circle } from "lucide-react";
import { Star, Timer } from "../components/icons";
import { useMenu } from "../hooks/useMenu";
import { useCart } from "react-use-cart";
import { toast } from "sonner";
import AddProductToCartSuccess from "../modals/add-product-to-cart-success";

const ProductDetailsContent = ({ product, productId }) => {
  const { resInfo } = useMenu();
  const { addItem, updateItemQuantity, getItem, updateItem } = useCart();
  const toppings = useMemo(() => product?.toppings || [], [product]);
  const extravariants = useMemo(() => product?.extravariants || [], [product]);
  const cartItem = getItem(productId);
  const currency = resInfo.currency || "MAD";
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [productCustomizations, setProductCustomizations] = useState([]);
  const [note, setNote] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuantityChange = useCallback(
    (change) => {
      setQuantity((prev) => Math.max(1, prev + change));

      if (!cartItem) {
        addItem(product, Math.max(1, quantity + change));
      } else {
        updateItemQuantity(cartItem.id, Math.max(1, quantity + change));
      }
    },
    [addItem, cartItem, product, quantity, updateItemQuantity]
  );

  const handleToppingToggle = useCallback((topping, selectMuliple) => {
    if (!selectMuliple) {
      setSelectedToppings((prev) => (prev.includes(topping) ? [] : [topping]));
      return;
    }

    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  }, []);

  const handleExtraToggle = useCallback((extra, selectMultiple) => {
    if (!selectMultiple) {
      setSelectedExtras((prev) => (prev.includes(extra) ? [] : [extra]));
      return;
    }

    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  }, []);

  const handleCustomizationToggle = useCallback((item) => {
    setProductCustomizations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  // handle extravariants and toppings grouping function
  const handleGroupings = (selectedGroup, groupOptions) => {
    return selectedGroup
      .map((group) => {
        const groupObj = groupOptions.find((t) =>
          t.options.some((op) => op.name === group)
        );
        if (groupObj) {
          const { name, options: groupOptions, ...rest } = groupObj;
          const options = groupObj.options.filter((op) => op.name === group);
          return { name, options, ...rest };
        }
        return null;
      })
      .filter(Boolean);
  };

  // parse options and return valid options
  const parseOptions = (options) => {
    return JSON.parse(options)
      ?.map((option) => ({
        ...option,
        price: isNaN(parseFloat(option?.price))
          ? 0
          : parseFloat(option?.price || 0),
      }))
      ?.filter((option) => option?.name);
  };

  const calculateTotalPrice = useCallback(() => {
    const initialTotal = parseFloat(product.price) * quantity;

    const calculateOptionsTotal = (options, selected) =>
      options.reduce((total, option) => {
        if (selected.includes(option?.name)) {
          return total + parseFloat(option?.price);
        }
        return total;
      }, 0);

    const toppingsPrice = toppings.reduce((total, topping) => {
      const options = parseOptions(topping.options);
      return total + calculateOptionsTotal(options, selectedToppings);
    }, 0);

    const extrasPrice = extravariants.reduce((total, extras) => {
      const options = parseOptions(extras?.options);
      return total + calculateOptionsTotal(options, selectedExtras);
    }, 0);

    return (initialTotal + toppingsPrice + extrasPrice).toFixed(2);
  }, [
    extravariants,
    product.price,
    quantity,
    selectedExtras,
    selectedToppings,
    toppings,
  ]);

  const isOptionRequired = (options, selectedOptions) => {
    // Extract required options
    const requiredOptions = options
      ?.filter((option) => option?.required)
      .flatMap((option) => option?.options.map((option) => option?.name));

    // Check if all required options are in selected options
    const allOptionsSelected = requiredOptions.some((requiredOption) =>
      selectedOptions.some((selectedOption) =>
        selectedOption?.options.some(
          (option) => option?.name === requiredOption
        )
      )
    );

    return {
      allOptionsSelected,
      isRequired: requiredOptions.length > 0,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const toppingsOptions = toppings?.map((topping) => {
      return {
        ...topping,
        options: parseOptions(topping?.options),
      };
    });

    const extrasOptions = extravariants?.map((extras) => {
      return {
        ...extras,
        options: parseOptions(extras?.options),
      };
    });

    const selectedToppingsOptions = handleGroupings(
      selectedToppings,
      toppingsOptions
    );

    const selectedExtrasOptions = handleGroupings(
      selectedExtras,
      extrasOptions
    );

    const {
      allOptionsSelected: isToppingOptionRequired,
      isRequired: isToppingRequired,
    } = isOptionRequired(toppingsOptions, selectedToppingsOptions);

    const {
      allOptionsSelected: isExtrasOptionRequired,
      isRequired: isExtrasRequired,
    } = isOptionRequired(extrasOptions, selectedExtrasOptions);

    if (isToppingRequired && !isToppingOptionRequired) {
      return toast.error("Choose at least one item from a required field.");
    }

    if (isExtrasRequired && !isExtrasOptionRequired) {
      return toast.error("Choose at least one item from a required field.");
    }

    const sizes = selectedToppingsOptions?.filter(
      (topping) => topping?.name?.toLowerCase() === "size"
    );

    if (!cartItem) {
      addItem(product, quantity);
    } else {
      updateItemQuantity(cartItem.id, quantity);
    }

    updateItem(productId, {
      ...product,
      quantity: quantity,
      ingredients: product?.ingredients?.filter(
        (ing) => !productCustomizations.includes(ing?.name)
      ),
      toppings: selectedToppingsOptions,
      extravariants: selectedExtrasOptions,
      productTotal: parseFloat(calculateTotalPrice()).toFixed(2),
      comment: note || "",
      size: sizes
        .map((size) => size?.options.map((option) => option?.name))
        .join(", "),
    });

    setIsModalOpen(true);

    e.target.reset();
    setSelectedExtras([]);
    setSelectedToppings([]);
    setProductCustomizations([]);
    setNote("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="px-7 flex-1 pt-[13px] overflow-hidden">
          <div className="max-w-md mx-auto">
            <div className="mb-3">
              <h2 className="text-sm font-semibold capitalize text-[#797D81]">
                {product.categorie?.name}
              </h2>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <div className="flex items-center p-[4.372px] bg-[#EAEAEA] rounded-full">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="flex items-center justify-center w-8 h-8 bg-white rounded-full"
                  >
                    <Minus size={20} color="black" />
                  </button>
                  <span className="font-rs-text-semibold mx-3">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="flex items-center justify-center w-8 h-8 bg-white rounded-full"
                  >
                    <Plus size={20} color="black" />
                  </button>
                </div>
              </div>

              {/* Timer and Rating */}
              <div className="mb-7 flex items-center justify-between w-full text-sm">
                {/* Rating */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium text-sm text-[#9A9CA5]">Rating</h4>
                  <div className="flex items-center gap-1">
                    <Star />
                    <span className="text-sm font-semibold text-black">
                      4.4
                    </span>
                  </div>
                </div>

                {/* Timer*/}
                <div className="flex flex-col items-center justify-center gap-2 mx-auto">
                  <h4 className="font-medium text-sm text-[#9A9CA5]">Time</h4>
                  <div className="flex items-center gap-1">
                    <Timer />
                    <span className="text-sm font-semibold text-black">
                      15 min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 font-semibold">Description</h4>
              {product.desc.length < 100 ? (
                <p className="text-sm text-[#767884]">{product.desc}</p>
              ) : (
                <p className="text-sm text-[#767884]">
                  {showFullDescription ? (
                    <>
                      {product.desc}
                      <button
                        type="button"
                        className="ml-1 text-[#F97D49]"
                        onClick={() => setShowFullDescription(false)}
                      >
                        Read Less
                      </button>
                    </>
                  ) : (
                    <>
                      {product.desc.slice(0, 100)}
                      <button
                        type="button"
                        className="ml-1 text-[#F97D49]"
                        onClick={() => setShowFullDescription(true)}
                      >
                        Read More
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>

            {product.toppings.length > 0 &&
              product.toppings.map((topping) => {
                const options = JSON.parse(topping.options)
                  ?.map((option) => ({
                    ...option,
                    price: parseFloat(option.price || 0),
                  }))
                  .filter((option) => option.name);
                const isRequired = topping.required;
                const selectMuliple = topping.multiple_selection;
                const toppingName = topping.name;

                return (
                  <div
                    className={`mb-4 ${options.length > 0 ? "" : "hidden"}`}
                    key={topping.id}
                  >
                    <h4 className="mb-0.5 overflow-hidden whitespace-nowrap font-semibold flex items-center gap-1">
                      Select{" "}
                      <span className="capitalize">
                        {toppingName?.split(" ")[0]}
                      </span>{" "}
                      for your{" "}
                      <span className="capitalize">
                        {product.categorie?.name}
                      </span>
                      {isRequired && (
                        <span className="px-2 py-1 ml-1 text-xs font-normal text-white bg-orange-500 rounded-full">
                          Required
                        </span>
                      )}
                    </h4>
                    <p className="mb-4 text-xs text-gray-500">
                      {selectMuliple
                        ? `Choose a maximum of ${options?.length} items`
                        : "Select only one item"}
                    </p>

                    {options?.map((option) => (
                      <div
                        key={option.name}
                        className="flex items-center justify-between mb-4 border-b border-b-[#E0E0E0] pb-2 last:border-b-0"
                      >
                        <span
                          className={`capitalize font-medium ${
                            selectedToppings?.includes(option.name)
                              ? "text-[#0D0D0D]"
                              : "text-[#494949] opacity-70"
                          } `}
                        >
                          {option.name} {product.categorie?.name}
                        </span>
                        <div className="flex items-center">
                          <span
                            className={`mr-2 text-[#F86A2E] ${
                              selectedToppings?.includes(option.name)
                                ? "opacity-100"
                                : "opacity-70"
                            }`}
                          >
                            {option.price.toFixed(2)} {currency}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleToppingToggle(option.name, selectMuliple)
                            }
                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              selectedToppings?.includes(option.name)
                                ? "bg-white border-[1.5px] border-[#F86A2E]"
                                : "border-[#F86A2E] opacity-70 border-2"
                            } flex items-center justify-center`}
                          >
                            {selectedToppings?.includes(option.name) && (
                              <Circle
                                size={17}
                                className="text-[#F86A2E] fill-[#F86A2E]"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

            {product.extravariants.length > 0 &&
              product.extravariants.map((extra) => {
                const options = JSON.parse(extra.options)
                  ?.map((option) => ({
                    ...option,
                    price: parseFloat(option.price || 0),
                  }))
                  .filter((option) => option.name);
                const isRequired = extra.required;
                const selectMuliple = extra.multiple_selection;
                const extraName = extra.name;

                return (
                  <div
                    className={`mb-4 ${options.length > 0 ? "" : "hidden"}`}
                    key={extra.id}
                  >
                    <h4 className="mb-0.5 font-semibold flex items-center gap-1">
                      Select Extras for your{" "}
                      <span className="capitalize">
                        {product.categorie?.name}
                      </span>
                      {isRequired && (
                        <span className="px-2 py-1 ml-1 text-xs font-normal text-white bg-orange-500 rounded-full">
                          Required
                        </span>
                      )}
                    </h4>
                    <p className="mb-4 text-xs text-gray-500">
                      {selectMuliple
                        ? `Choose a maximum of ${options?.length} items`
                        : "Select only one item"}
                    </p>

                    {options?.map((option) => (
                      <div
                        key={option.name}
                        className="flex items-center justify-between mb-4 border-b border-b-[#E0E0E0] pb-2 last:border-b-0"
                      >
                        <span
                          className={`capitalize font-medium ${
                            selectedExtras?.includes(option.name)
                              ? "text-[#0D0D0D]"
                              : "text-[#494949]"
                          } `}
                        >
                          {option.name} {extraName}
                        </span>
                        <div className="flex items-center">
                          <span
                            className={`mr-2 ${
                              selectedExtras?.includes(option.name)
                                ? "text-[#63AA08]"
                                : "text-[#F86A2E]"
                            }`}
                          >
                            {option.price.toFixed(2)} {currency}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleExtraToggle(option.name, selectMuliple)
                            }
                            className={`w-6 h-6 rounded-full border ${
                              selectedExtras?.includes(option.name)
                                ? "bg-[#63AA08] border-[#63AA08]"
                                : "bg-[#F86A2E] border-[#F86A2E]"
                            } flex items-center justify-center`}
                          >
                            {selectedExtras?.includes(option.name) ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <Plus size={16} className="text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

            {product.ingredients.length > 0 &&
              product?.ingredients.filter((item) => item.name).length > 0 && (
                <div className="mt-6 mb-4">
                  <h4 className="mb-0.5 font-semibold capitalize">
                    Customise Your {product.categorie?.name}
                  </h4>
                  <p className="mb-4 text-xs text-gray-500">
                    {product.ingredients.length > 1
                      ? `Choose a maximum of ${product.ingredients.length} items`
                      : "Select only one item"}
                  </p>
                  {product.ingredients.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-4 border-b border-b-[#E0E0E0] pb-2 last:border-b-0"
                    >
                      <span className="capitalize">No {item?.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCustomizationToggle(item?.name)}
                        className={`w-6 h-6 rounded-full border ${
                          productCustomizations.includes(item?.name)
                            ? "bg-red-500 border-red-500"
                            : "bg-[#F86A2E] border-[#F86A2E]"
                        } flex items-center justify-center`}
                      >
                        {productCustomizations.includes(item?.name) ? (
                          <X size={16} className="text-white" />
                        ) : (
                          <Plus size={16} className="text-white" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

            <div className="mt-8 mb-4">
              <h4 className="mb-4 font-semibold">Note</h4>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your note here"
                className="w-full h-28 text-base rounded-[13px] border border-[#E2E4EA] p-[16px_19px] outline-none focus:outline-none text-black placeholder:text-[#9DA0A3]"
                rows={10}
              />
            </div>
          </div>
        </div>

        <div className="px-7 bottom-5 fixed left-0 right-0 flex items-center justify-between w-full max-w-md py-4 mx-auto mt-4 -mb-5 bg-white border-t border-gray-200">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-base text-[#8C8E98]">
                Order Total
              </span>
              <span className="text-xl font-medium text-[#191D31]">
                {calculateTotalPrice()}{" "}
                <span className="text-[#F86A2E] text-xs font-semibold">
                  {currency}
                </span>
              </span>
            </div>
            <button
              type="submit"
              className="w-full text-center py-3 font-medium text-white bg-[#F86A2E] rounded-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </form>

      <AddProductToCartSuccess open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default ProductDetailsContent;
