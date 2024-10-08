import { FaChevronLeft } from "react-icons/fa";
import { FontItalicIcon } from "@radix-ui/react-icons";
import React, { useState , useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { CartItemSuggestionT3 } from "../../components/CartItemSuggestionT3";




function Search({ infoRes, slug , categories , selectedDishes, customization, restos, tableName}) {
  // const { customization, restos, resInfo, table_id, tableName, selectedDishes,restoSlug } = useMenu();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  
  

  const resto_id = customization.resto_id;
  const cartItems = useSelector((state) => state.cart.items);
  const isDishInCart = (dishId) => {
    return cartItems.some(item => item.id === dishId);
  };
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  // console.log("restos id ============= ", customization.resto_id);
  
  const filtredSuggest = selectedDishes.filter(suggestedDish => 
    !filteredCartItems.some(cartItem => cartItem.id === suggestedDish.id)
  );  
  
  useEffect(() => {
    if(filtredSuggest.length == 0)
      {
        setIsModalOpen(false)
      }
    }, [filtredSuggest])
    
  
  let allProducts = [];
  categories.forEach(category => {
    const dishNames = category.dishes.map(dish => dish.name);
    const drinkNames = category.drinks.map(drink => drink.name);
    allProducts = [...allProducts, ...dishNames, ...drinkNames];
  });

  
  const handleSearch = (e) => {
    const value = e.target.value; 
    setSearchTerm(value); 

    
    if (value === "") {
      setFilteredProducts([]); 
    } else {
      
      const filtered = allProducts.filter(product =>
        product.toLowerCase().includes(value.toLowerCase()) 
      );
      setFilteredProducts(filtered); 

      if (value.trim() && !searchHistory.includes(value)) {
        setSearchHistory([...searchHistory, value]);
      }
    }
  };


  return (
    <>
      {/* <div className="w-full h-full "> */}

          {/* search  */}
        {/* <div className=' top-0 w-full h-[80px] '>
          <div className='my-4 w-full  h-[60px] flex items-center'>
            <button className="w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#898989] ml-4 flex justify-center items-center">
              <FaChevronLeft />
            </button>
            <form className="w-[291px] mx-auto ">   
                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" 
                    class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search For Food ..." required 
                    value={searchTerm} 
                    onChange={handleSearch}
                    />
                </div>
            </form>
          </div>
        </div> */}

              <div className="fixed top-0 w-full h-[80px] bg-white z-50"> 
                {/* search  */}
                <div className='my-4 w-full h-[60px] flex items-center'>
                  <button className="w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#898989] ml-4 flex justify-center items-center">
                    <FaChevronLeft />
                  </button>
                  <form className="w-[291px] mx-auto">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search For Food ..."
                        required
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>


              <div className="pt-[80px]"> 
                  {/* contenu de la page */}


              {/* Affichage des résultats filtrés */}
                    {filteredProducts.length > 0 ? (
                      <div className="results-list h-full">
                      <ul>
                        {filteredProducts.map((product, index) => (
                          <li key={index} className="p-2 border-b border-gray-300">
                            {product}
                          </li>
                        ))}
                      </ul>
                      </div>
                    ) : (
                      searchTerm && <p className="p-2">Aucun résultat trouvé</p>
                    )}


            {/* History Record */}
              {searchHistory.length > 0 && (
                <div className="w-full flex justify-center items-center">
                  <div className="w-[90%] h-full">
                    <h1 className=" text-[#2F2F2F] font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px]">History Record</h1>
                    <div className="w-full h-[70%]">
                      {searchHistory.map((historyItem, index) => (
                        <button key={index} className="mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full">
                          <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">{historyItem}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}




        {/* Suggetion */}

        <div className=" w-full h-auto mt-4 flex justify-center items-center ">
          <div className="w-[90%] ">
          <h1 className="mb-2 text-[#2F2F2F] font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px]">You May Like</h1>
            <div className="grid grid-cols-2 gap-0 p-2 mb-3 ">
              {filtredSuggest?.slice(0, 4).map((item, index) => (
                   <CartItemSuggestionT3
                     key={index}
                     item={item}
                      infoRes={infoRes}
                      customization={customization}
                      resto_id={customization.resto_id}
                      isDishInCart={isDishInCart}
                   />
              ))}
            </div>
            </div>
          </div>
              </div>

      {/* </div> */}
    </>
  )
};

export default Search;