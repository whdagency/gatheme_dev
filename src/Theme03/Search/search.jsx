import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { FontItalicIcon } from "@radix-ui/react-icons";
import React, { useState , useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { CartItemSuggestionT3 } from "../../components/CartItemSuggestionT3";
import { CartItemProductSearch } from "../../components/CartItemProductSearch";
import { CgClose } from "react-icons/cg";

import filter from "../Search/filter.svg";




function Search({ infoRes, slug , categories , selectedDishes, customization, restos, tableName}) {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false);
  const [showCartDish, setshowCartDish] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [showFilterPage, setshowFilterPage] = useState(false);





  
  

  const resto_id = customization.resto_id;
  const cartItems = useSelector((state) => state.cart.items);
  const isDishInCart = (dishId) => {
    return cartItems.some(item => item.id === dishId);
  };
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  // console.log("restos id ============= ", customization.resto_id);
  console.log("table name  ====== ",tableName);
  
  const filtredSuggest = selectedDishes;
  
  
   let allProducts = [];
   categories.forEach(category => {
     const dishNames = category.dishes.map(dish => dish.name);
     const drinkNames = category.drinks.map(drink => drink.name);
     allProducts = [...allProducts, ...dishNames, ...drinkNames];
   });

   const getFilteredProducts = (searchTerm) => {
    if (!searchTerm) {
      return []; 
    }
  
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    
    let filteredProducts = [];
  
    
    categories.forEach(category => {

      const matchingDishes = category.dishes.filter(dish =>
        dish.name.toLowerCase().includes(lowerCaseSearchTerm)
      );

      const matchingDrinks = category.drinks.filter(drink =>
        drink.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
  
      
      filteredProducts = [...filteredProducts, ...matchingDishes, ...matchingDrinks];
    });
  
    return filteredProducts;
  };
  
  
  const filteredResults = getFilteredProducts(searchTerm);
  console.log("Produits filtrés: ", filteredResults);


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
   
  
    if (value === "") {
      setFilteredProducts([]); 
      setIsSearching(false);   
      setIsFilterButtonVisible(false);
      setSelectedItem(false); 
    } else {
      const filtered = allProducts.filter(product =>
        product.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSearching(true);  

    }
  };


   const handleResultClick = (result) => {
    setSearchTerm(result);
    setSelectedItem(true); 

    if (!searchHistory.includes(result)) {
      setSearchHistory(prevHistory => [...prevHistory, result]);
    }
    
    setIsFilterButtonVisible(true);
    setshowCartDish(true);

  };

  const handlefilter = () => {
    setshowFilterPage(true);
  }


  const options = [
    { label: "Price: Low to High", value: "low-to-high" },
    { label: "Price: High to Low", value: "high-to-low" },
    { label: "Reviews", value: "reviews" },
    { label: "Newest", value: "newest" },
    { label: "Just for you", value: "just-for-you" },
  ];

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelection = (value) => {
    setSelectedOption(value);
  };


  const priceOptions = [1, 20, 70, 100];

  const [selectedMin, setSelectedMin] = useState(priceOptions[1]);
  const [selectedMax, setSelectedMax] = useState(priceOptions[2]);

  const handlePriceClick = (price) => {
    if (price < selectedMin) {
      setSelectedMin(price);
    } else if (price > selectedMax) {
      setSelectedMax(price);
    } else {
      // Si le prix cliqué est entre min et max, ajuster en fonction de la distance
      if (price - selectedMin < selectedMax - price) {
        setSelectedMin(price);
      } else {
        setSelectedMax(price);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 
      setSearchTerm(e.target.value);
      // setSearchHistory(e.target.value);
      // console.log('Recherche validée:', e.target.value);
     
    }
  };


  return (
    <>
              <div className="relative w-full h-full">
                {/* Champ de recherche */}
                <div className='fixed top-0 w-full bg-white h-[80px] z-40'>
                  <div className='my-4 w-full h-[60px] flex items-center'>
                    <Link to="/menu/${slug}?table_id=${table_id}" className="w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#898989] ml-4 flex justify-center items-center">
                      <FaChevronLeft />
                     </Link>

                    <div className="w-[291px] mx-auto">
                      <div className="flex items-center relative">
                        <input
                          type="search"
                          id="default-search"
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Search For Food ..."
                          required
                          value={searchTerm}
                          onChange={handleSearch}
                          onKeyDown={handleKeyDown}
                        />
                        
                        {isFilterButtonVisible && ( 
                            <img src={filter} alt="filter" className="ml-2 h-[50px] "
                            onClick={handlefilter}
                            />
                        )}
                      </div>
                    </div>

                  </div>
                </div>
                
                {showFilterPage && (
                  <div className="w-full h-full z-50 bg-[white] fixed">
                      <div className="top-0 w-full bg-white h-[80px] flex items-center justify-between px-4 border-2 border-b-gray-700">
                          <div className="mx-1" onClick={() => {setshowFilterPage(false)}}>
                            <CgClose color="black" size={25}/>
                          </div>
                          <h1 className="text-xl font-semibold text-center flex-grow text-black">
                            Filter
                          </h1>
                          <div className="w-[50px]"></div>
                      </div>
                      <div className="w-full h-[300px]  border-2 border-b-gray-700  flex justify-center">
                      <div className="w-[90%] flex flex-col gap-4">
                            <h1 className="text-lg font-semibold mb-2 mt-6">Sort by</h1>
                                {options.map((option) => (
                                    <label key={option.value} className="flex items-center">
                                          <input
                                            type="radio"
                                            name="sort"
                                            className="hidden"
                                            value={option.value}
                                            onChange={() => handleSelection(option.value)}
                                          />
                                          <div
                                            className={`w-6 h-6 flex items-center justify-center border ${
                                              selectedOption === option.value ? 'border-black' : 'border-gray-400'
                                            } rounded-full cursor-pointer`}
                                          >
                                            <div
                                              className={`circle-inner ${
                                                selectedOption === option.value ? 'bg-black' : 'bg-transparent'
                                              } w-3 h-3 rounded-full`}
                                            ></div>
                                          </div>
                                          <span className="ml-3">{option.label}</span>
                                    </label>
                                ))}
                          </div>

                      </div>
                      <div className="w-full h-[150px] flex justify-center ">
                          <div className="w-[90%] flex flex-col gap-4 ">
                            <h1 className="text-lg font-semibold mb-2 mt-6">Sort by</h1>
                            <div className="flex flex-col items-center my-4">
                                <div className="relative w-full h-2 bg-gray-300">
                                  <div
                                    className="absolute h-2 bg-red-500"
                                    style={{
                                      left: `${(priceOptions.indexOf(selectedMin) / (priceOptions.length - 1)) * 100}%`,
                                      right: `${100 - (priceOptions.indexOf(selectedMax) / (priceOptions.length - 1)) * 100}%`,
                                    }}
                                  >
                                  </div>
                                  {priceOptions.map((price, index) => (
                                    <div
                                      key={index}
                                      className="absolute -top-2 w-6 h-6 flex items-center justify-center"
                                      style={{
                                        left: `${(index / (priceOptions.length - 1)) * 100}%`,
                                        transform: 'translateX(-50%)',
                                      }}
                                      onClick={() => handlePriceClick(price)}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full ${
                                          price >= selectedMin && price <= selectedMax ? 'bg-red-500' : 'bg-gray-300'
                                        } cursor-pointer`}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between w-full mt-4">
                                  {priceOptions.map((price, index) => (
                                    <span 
                                      key={index} 
                                      className={`text-gray-600 text-sm ${price === 1 ? 'ml-[-4px]' : ''} ${price === 100 ? 'mr-[-12px]' : ''}`}
                                    >
                                      {price}$
                                    </span>
                                  ))}
                                </div>
                      </div>


                        </div>
                      </div>

                      <div className="fixed bottom-0 w-full h-[100px]  flex justify-center items-center">
                          <div className="w-[90%] h-[60px]  flex mx-auto">
                              <button className="w-[170px] h-[45px] bg-[white] border-2 border-[red] border-solid  text-[red] hover:bg-[red] hover:text-[white] rounded-lg mx-1" onClick={() => {setshowFilterPage(false)}}>Cancel</button>
                              <button className="w-[170px] h-[45px] bg-[white] text-[red] hover:bg-[red] hover:text-[white] border-2 border-[red] border-solid rounded-lg mx-1">Confirm</button>
                          </div>
                      </div>

                  </div>
                  
                
                )}
                  
                {isSearching && filteredProducts.length > 0 && (
                  <div className=" pt-[80px]  left-0  h-full ">
                    <div className="w-full  bg-white h-full  overflow-y-auto">
                        {!selectedItem && (
                          
                          <ul className="p-2">
                          {filteredProducts.map((product, index) => (
                            <div className=" w-full text-[#565656] flex flex-row border-b border-gray-300 justify-between items-center ">
                            <li
                              key={index}
                              className="p-4  cursor-pointer"
                              onClick={() => handleResultClick(product)}
                            >
                              {product}
                            </li>
                            <div className="mr-[15px]">
  
                              <FaChevronRight />
                            </div>
                            </div>
                          ))}
                          </ul>
                        )}
                       {selectedItem && (
                        <ul className="w-full gap-2 ">

                          {filteredResults.map((item, index) => (
                            <div className=" w-full  text-[#565656] flex flex-row border-b border-gray-300 justify-between items-center "
                            key={index}
                            >
                            <li className="w-[90%] mx-auto my-2">

                              <CartItemProductSearch
                                // key={index}
                                item={item}
                                infoRes={infoRes}
                                customization={customization}
                                resto_id={customization.resto_id}
                                isDishInCart={isDishInCart}
                              />
                            </li>
                            </div>
                         ))}
                        </ul>
                        )}

                        
                    </div>
                  </div>
                )}

               
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


