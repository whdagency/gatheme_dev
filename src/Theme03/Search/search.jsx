import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { FontItalicIcon } from "@radix-ui/react-icons";
import React, { useState , useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { CartItemSuggestionT3 } from "../../components/CartItemSuggestionT3";




function Search({ infoRes, slug , categories , selectedDishes, customization, restos, tableName}) {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();


  
  

  const resto_id = customization.resto_id;
  const cartItems = useSelector((state) => state.cart.items);
  const isDishInCart = (dishId) => {
    return cartItems.some(item => item.id === dishId);
  };
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  // console.log("restos id ============= ", customization.resto_id);
  
  // const filtredSuggest = selectedDishes.filter(suggestedDish => 
  //   !filteredCartItems.some(cartItem => cartItem.id === suggestedDish.id)
  // );  
  const filtredSuggest = selectedDishes;
  
  
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
       setIsSearching(false); // Désactiver la recherche si le champ est vide
     } else {
      
       const filtered = allProducts.filter(product =>
         product.toLowerCase().includes(value.toLowerCase()) 
       );
       setFilteredProducts(filtered); 
       setIsSearching(true);
     }
   };

   // Ajouter à l'historique  l'utilisateur appuie sur "Entrée"
   const handleKeyDown = (e) => {
    if (e.key === "Enter") {
     e.preventDefault(); // Empêche la soumission du formulaire par défaut
  if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
        setSearchHistory(prevHistory => [...prevHistory, searchTerm]); // Ajouter le terme complet
      }
    }
  };

  
   const handleBlur = () => {
     if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      setSearchHistory(prevHistory => [...prevHistory, searchTerm]); // Ajouter le terme complet
      setIsSearching(false);
     }
   };


  return (
    <>
              <div className="relative w-full h-full">
                {/* Champ de recherche */}
                <div className='fixed top-0 w-full bg-white h-[80px] z-50'>
                  <div className='my-4 w-full h-[60px] flex items-center'>
                    <Link to="/menu/${slug}?table_id=${table_id}" className="w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#898989] ml-4 flex justify-center items-center">
                      <FaChevronLeft />
                     </Link>
                    
                    <form className="w-[291px] mx-auto">
                      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                      <div className="relative">
                        <input type="search" id="default-search" 
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                          placeholder="Search For Food ..." required 
                          value={searchTerm} 
                          onChange={handleSearch}
                          onFocus={() => setIsSearching(searchTerm !== "")}
                          onBlur={handleBlur}
                        />
                      </div>
                    </form>
                  </div>
                </div>

                  {/* Résultats de recherche */}
                {isSearching && filteredProducts.length > 0 && (
                  <div className=" pt-[80px]  left-0  h-full ">
                    <div className="w-full  bg-white h-full  overflow-y-auto">
                      <ul className="p-2">
                        {filteredProducts.map((product, index) => (
                          <div className=" w-full text-[#565656] flex flex-row border-b border-gray-300 justify-between items-center ">
                          <li
                            key={index}
                            onClick={() => {}}
                            className="p-4  cursor-pointer"
                          >
                            {product}
                          </li>
                          <div className="mr-[15px]">

                            <FaChevronRight />
                          </div>
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Message d'aucun résultat trouvé */}
                {isSearching && filteredProducts.length === 0 && searchTerm && (
                  <p className="p-2 pt-[80px] left-0 h-full">Aucun résultat trouvé</p>
                )}

              {!isSearching && (
                    <div className="w-full  pt-[80px] ">

                    {searchHistory.length > 0 && (
                      <div className="w-full my-2  flex justify-center items-center">
                        <div className="w-[90%] h-full">
                          <h1 className=" text-[#2F2F2F] my-2 font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px]">History Record</h1>
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


                      {/* Suggestions */}
                      <div className="w-full h-auto my-2 flex justify-center items-center ">
                        <div className="w-[90%]">
                          <h1 className="text-[#2F2F2F] font-bold my-2">You May Like</h1>
                          {/* <div className="grid grid-cols-2 gap-2 p-2 mb-3"> */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 mb-[100px] lg:mb-[150px]">
                            {/* {filtredSuggest?.slice(0, 4).map((item, index) => (
                              <CartItemSuggestionT3
                                key={index}
                                item={item}
                                infoRes={infoRes}
                                customization={customization}
                                resto_id={customization.resto_id}
                                isDishInCart={isDishInCart}
                              />
                            ))} */}
                            {filtredSuggest?.map((item, index) => (
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

)}
      </div>



    </>
  )
};

export default Search;