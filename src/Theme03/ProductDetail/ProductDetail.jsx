import { Link,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { APIURL, APIURLS3 } from '../../lib/ApiKey';
import { color } from 'framer-motion';
import { MinusIcon, PlusIcon } from "../../constant/page";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus } from "react-icons/fa6";
import { SiVerizon } from "react-icons/si";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector  } from "react-redux";
import { incrementQuantity, decrementQuantity } from '../../lib/cartSlice';








const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Récupère l'item passé via la navigation
  const item = location.state?.item;

    // Quantité gérée localement dans le composant
    const [localQuantity, setLocalQuantity] = useState(1); // Quantité initiale à 1

    // Fonction pour incrémenter la quantité
    const incrementQuantity = () => {
      setLocalQuantity((prevQuantity) => prevQuantity + 1);
    };

    // Fonction pour décrémenter la quantité
    const decrementQuantity = () => {
      if (localQuantity > 1) {
        setLocalQuantity((prevQuantity) => prevQuantity - 1);
      }
    };


    const [selectedIndex, setSelectedIndex] = useState(null); // Gérer l'index sélectionné
    const [selectedIndicesExtra, setSelectedIndicesExtra] = useState([]);

    const handleRadioClick = (index) => {
      setSelectedIndex(index); // Mettre à jour l'index sélectionné
    };

    const handleButtonextra = (index) => {
      if (selectedIndicesExtra.includes(index)) {
        // Si l'élément est déjà sélectionné, on le retire
        setSelectedIndicesExtra(selectedIndicesExtra.filter(i => i !== index));
      } else {
        // Sinon, on l'ajoute
        setSelectedIndicesExtra([...selectedIndicesExtra, index]);
      }
    };


    const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Gestion de la sélection des ingrédients
  const handleIngredientClick = (index) => {
    if (selectedIngredients.includes(index)) {
      // Si l'élément est déjà sélectionné, on le retire
      setSelectedIngredients(selectedIngredients.filter(i => i !== index));
    } else {
      // Sinon, on l'ajoute
      setSelectedIngredients([...selectedIngredients, index]);
    }
  };


    // console.log("item = ",item);
    useEffect(() => {
        if (item) {
          console.log("Détails du produit sélectionné:", item);
        } else {
          console.error("Aucun item trouvé dans l'état.");
        }
      }, [item]);

      // console.log("item id =====  ", item.id);
      // console.log("item quantity ====  ", item.quantity);
       // Calcul du total (quantité * prix)
  const totalPrice = localQuantity * item.price;

    return (
      <div className='w-full h-full bg-[white]'>
        <div className='relative w-full h-[252px] '>
            {item.image1 && (
                <img src={`${APIURLS3}/${item.image1}`} alt={item.name} className='w-full h-full ' />
            )}

            <Link to="/menu/${slug}?table_id=${table_id}" className="absolute top-8 w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#DADADA] ml-4 flex justify-center items-center">
                          <FaChevronLeft color= "white" />
            </Link>
            <div className='absolute bottom-3 right-0 w-[154px] h-[41px] bg-[white] rounded-tl-[20px] ' >
              <div className='flex justify-evenly items-center w-full h-full'>
              <div className='flex items-center   w-[68px] h-[21px] gap-1 '>
                  <svg className='' xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 18" fill="none">
                    <path d="M8.72745 16.4098C12.4866 16.4098 15.534 13.394 15.534 9.67376C15.534 5.95356 12.4866 2.93774 8.72745 2.93774C4.9683 2.93774 1.9209 5.95356 1.9209 9.67376C1.9209 13.394 4.9683 16.4098 8.72745 16.4098Z" fill="#CED3ED"/>
                    <path d="M10.9056 2.39881H6.54941C6.24992 2.39881 6.00488 2.15631 6.00488 1.85993C6.00488 1.56354 6.24992 1.32104 6.54941 1.32104H10.9056C11.2051 1.32104 11.4501 1.56354 11.4501 1.85993C11.4501 2.15631 11.2051 2.39881 10.9056 2.39881ZM8.7275 10.2126C8.42801 10.2126 8.18298 9.97009 8.18298 9.67371V6.17098C8.18298 5.87459 8.42801 5.6321 8.7275 5.6321C9.02699 5.6321 9.27203 5.87459 9.27203 6.17098V9.67371C9.27203 9.97009 9.02699 10.2126 8.7275 10.2126Z" fill="#4257FF"/>
                  </svg>
                  <span className=' text-[14px]'>15min</span> 
                </div>
                  <div className='flex justify-center items-center w-[45px] h-[21px] gap-1 '>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                          <path d="M7.08737 0.810734C7.25053 0.313774 7.95354 0.313773 8.1167 0.810734L9.43571 4.82817C9.50873 5.05055 9.71632 5.20089 9.95038 5.20089H14.2067C14.7328 5.20089 14.9501 5.87526 14.5229 6.1824L11.0892 8.65127C10.8974 8.7892 10.8171 9.03557 10.8908 9.26006L12.2046 13.2617C12.3682 13.7598 11.7994 14.1766 11.3737 13.8705L7.91826 11.386C7.72933 11.2501 7.47474 11.2501 7.2858 11.386L3.83033 13.8705C3.40469 14.1766 2.8359 13.7598 2.99943 13.2617L4.31327 9.26006C4.38697 9.03557 4.30667 8.7892 4.11483 8.65127L0.681141 6.1824C0.253976 5.87526 0.47125 5.20089 0.99737 5.20089H5.25369C5.48775 5.20089 5.69534 5.05055 5.76835 4.82817L7.08737 0.810734Z" fill="#F2CF63"/>
                      </svg>
                      <span className="text-[14px]">5</span> 
                  </div>
              </div>
            </div>
            <div className='absolute bottom-0 rounded-tl-[10px] bg-[white] w-full h-4'>
            </div>
        </div>

        <div className=' w-[90%] mx-auto bg-[white] flex flex-col'>
            <div className='h-[61px]  flex  justify-between'>
              <div className=' flex flex-col justify-between'>
                <h1>{item.name}</h1>
                  <h3>{item.price} MAD</h3>
               
              </div>
              <div className=' flex justify-center items-center '>
              <div className="flex border-2 border-[#DB281C] rounded-full items-center gap-2">
                  <Button  size="icon" variant="outline" className="rounded-full w-[21px] h-[21px] bg-[#DB281C] mx-1"
                    onClick={decrementQuantity}
                  >
                    <MinusIcon className="w-4 h-4" style={{color: "white"}}/>
                  </Button>
                  <span className="text-base font-medium text-red-900 dark:text-gray-50 ">{localQuantity}</span>
                  <Button  size="icon" variant="outline" className="rounded-full w-[21px] h-[21px] bg-[#DB281C] mx-1"
                    onClick={incrementQuantity}
                  >
                    <PlusIcon className="w-4 h-4" style={{color: "white"}} />
                  </Button>
              </div>
              </div>
            </div>

            <div className='my-4'>
              {item.desc}
            </div>

            <div className='my-4'>
            {item.toppings && item.toppings.length > 0 && (
              <div>
              {item.toppings.map((topping, index) => {
                // Parse the options from the topping (as it is stored as a stringified JSON)
                const options = JSON.parse(topping.options);
                return (
                  <div key={index}>
                    {/* Affichage du nom du topping */}
                    <h1 className="text-lg font-bold">{topping.name}</h1>

                    {/* Mapping sur les options */}
                    {options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex justify-between items-center py-2"
                      >
                        <span>{option.name}</span>
                        <div className='flex  gap-4'>
                          <span className='text-[#F86A2E]'>{option.price},00 MAD</span>
                            <button
                              className="rounded-full border-2 border-[#F86A2E] w-[24px] h-[24px] flex justify-center items-center"
                              onClick={() => handleRadioClick(optIndex)}
                            >
                              {selectedIndex === optIndex && (
                                <div className="bg-[#F86A2E] rounded-full w-[14px] h-[14px]"></div>
                              )}
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
            </div>
            
            <span className='w-full border-2 border-[#EBEBEB] my-2'></span>

            <div className='my-2'>
              {item.extravariants && item.extravariants.length > 0 && (
                  <div>
                    {item.extravariants.map((extravariant, index) => {
                      const options = JSON.parse(extravariant.options);
                      return (
                        <div key={index}>
                          <h1 className="text-lg font-bold">{extravariant.name}</h1>
                          {options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex justify-between items-center py-2"
                            >
                              <span>{option.name}</span>

                               <div className='flex  gap-4'>
                                  <span className='text-[#F86A2E]'>{option.price} MAD</span>
                                  <button
                                      className={`rounded-full w-[24px] h-[24px] flex justify-center items-center 
                                        ${selectedIndicesExtra.includes(optIndex) ? 'bg-green-500' : 'bg-orange-500'}`}
                                      onClick={() => handleButtonextra(optIndex)}
                                    >
                                      {selectedIndicesExtra.includes(optIndex) ? <SiVerizon color='white' size={12} /> : <FaPlus color='white' />}
                                    </button>
                                </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>


            <span className='w-full border-2 border-[#EBEBEB] my-4'></span>


            <div>
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  {/* <h1 className="text-lg font-bold">{ingredients.name}</h1> */}
                  <h1 className='text-lg font-bold'>Customise  Your burger</h1>
                    {item.ingredients.map((ingredient, ingIndex) => (
                      <div key={ingIndex} className="flex justify-between items-center py-2">
                        <h3 className="text-lg ">{ingredient.name}</h3>
                        <button
                          className={`rounded-full w-[24px] h-[24px] flex justify-center items-center 
                            ${selectedIngredients.includes(ingIndex) ? 'bg-red-500' : 'bg-orange-500'}`}
                          onClick={() => handleIngredientClick(ingIndex)}
                        >
                          {selectedIngredients.includes(ingIndex) ? <IoMdClose color='white'  /> : <FaPlus color='white' />}
                        </button>
                      </div>
                    ))}

                </div>
              )}
            </div>


            <span className='w-full border-2 border-[#EBEBEB] my-4'></span>


            <div className='mb-4'>
                <h1 className='mb-2'>Note</h1>
                <Textarea placeholder="Write your note here." />
            </div>

            <span className='w-full border-2 border-[#EBEBEB] my-4'></span>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <h2 className='ml-6'>Totale</h2>
                    <h4 className='mr-6'>{totalPrice} MAD</h4>
                </div>
                <button className='w-full mb-4 rounded-lg h-[45px] text-[white] bg-[red]'>
                    Add to cart
                </button>
              </div>

            
            
               
            
        </div>
      </div>
    );
  };
  
  export default ProductDetail;
  


