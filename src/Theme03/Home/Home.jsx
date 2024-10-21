import React from 'react';
import Banner from '../Banner/Banner';
import Tab from '../Tabs/Tab';
import Footer from '../Footer/Footerv2';
import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import SelectBox from './../Navbar/selectbox';
import logo from './../Navbar/logo.svg';
import MenuItems from '../MenuItems/MenuItems';
import PromoComponent from '../promotion/Promotion';
import CatandProduct from '../Catandproduct/CatandPorduct';



const Home = ({
  filteredTheme,
  restos,
  resInfo,
  restoSlug,
  selectedTab,
  setSelectedTab,
  dishes,
  restoId,
  categories,
  filteredCategories,
  promo,
  resto_id, 
  selectedDishes
}) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const [t, i18n] = useTranslation("global");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // console.log("promo = ", promo);

  // const resto_id = customization.resto_id;
  const cartItems = useSelector((state) => state.cart.items);
  const isDishInCart = (dishId) => {
    return cartItems.some(item => item.id === dishId);
  };
  const filteredCartItems = cartItems.filter(item => item.resto_id === resto_id);
  // console.log("restos id ============= ", customization.resto_id);
  // console.log("table name  ====== ",tableName);
  
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
   
  
    if (value === "") {
      setFilteredProducts([]); 
      setIsSearching(false);   
      // setIsFilterButtonVisible(false);
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
    
    // setIsFilterButtonVisible(true);
    // setshowCartDish(true);

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


      <div className="w-full h-16 border-b-4 fixed bg-[white] flex justify-between items-center px-4 flex z-10">
        <div className='flex items-center'>
          <img src={logo} alt="logo" className="w-12 h-12 mx-2" />
          <h1 className="text-black text-xl font-bold">{restoSlug}</h1>        
        </div>
        <div className='relative z-20'>
          <SelectBox />
        </div>
      </div>

      <div className='pt-16 '>
        <div className='my-4 w-full h-[60px] '>
          <form className="w-[351px] mx-auto">   
              <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>

                      <div className="relative w-full">
                        <input 
                          type="search" 
                          id="default-search" 
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                          placeholder="Search For Food ..." 
                          value={searchTerm}
                          onChange={handleSearch}
                          onKeyDown={handleKeyDown}
                          required 
                        />

                        {isSearching && filteredProducts.length > 0 && (
                          <div className="absolute left-0 w-full mt-0 bg-[white]  z-10 max-h-[110px] border-2 border-gray-300 ">
                            <ul className="">
                              {filteredProducts.slice(0, 2).map((product, index) => (
                                <div 
                                  key={index} 
                                  className="w-full text-[#565656] bg-[white] flex flex-row border-b border-gray-300 justify-between items-center cursor-pointer"
                                  onClick={() => handleResultClick(product)}
                                >
                                  <li className="p-3">{product}</li>
                                </div>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                        
                    
              </div>
          </form>
        </div>
      </div>
      

      <div className='my-4 w-full h-[200px]  relative'>
        <PromoComponent promo={promo} />
      </div>

      <CatandProduct promo={promo} infoRes={resInfo} filteredCategories={filteredCategories} customization={filteredTheme} categories={categories} resto={restoId} tabel_id={extraInfo} dishes={dishes} selectedTab={selectedTab} setSelectedTab={setSelectedTab} slug={restoSlug}/>
      <Footer slug={restoSlug} customization={filteredTheme} table_id={extraInfo} infoRes={resInfo} resto_id={resto_id}/>

    </>
  );
};

export default Home;