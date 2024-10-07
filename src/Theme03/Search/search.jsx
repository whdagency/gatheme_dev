import { FaChevronLeft } from "react-icons/fa";
import { FontItalicIcon } from "@radix-ui/react-icons";
import React, { useState } from 'react';



function Search({ infoRes, slug , categories }) {

  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]);

  
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
    }
  };


  return (
    <>
      <div className="w-full h-full ">

        {/* search  */}
      <div className='pt-16 '>
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
      </div>

      {/* Affichage des résultats filtrés */}
      <div className="results-list">
            {filteredProducts.length > 0 ? (
              <ul>
                {filteredProducts.map((product, index) => (
                  <li key={index} className="p-2 border-b border-gray-300">
                    {product}
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm && <p className="p-2">Aucun résultat trouvé</p>
            )}
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 bg-[red] lg:grid-cols-4 2xl:grid-cols-5 gap-5 mb-[100px] lg:mb-[150px]'>

      </div>


        {/* History */}

        {/* {searchHistory.length > 0 && (
          <div className="w-full h-[200px]  flex justify-center items-center">
            <div className="w-[90%] h-full  ">
              <h1 className="my-4 text-[#2F2F2F] font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px]">
                History Record
              </h1>
              <div className="w-full h-[70%] flex flex-wrap">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    className="mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full"
                  >
                    <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">
                      {term}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* <div className="w-full h-[200px]  flex justify-center items-center">
          <div className="w-[90%] h-full  ">
            <h1 className="my-4 text-[#2F2F2F] font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px] ">History Record</h1>
            <div className="w-full h-[70%] ">
            <button class="border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Cheese Burger</h3>
            </button>

            <button class=" mx-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>

            <button class=" mx-2 my-2 border border-2 border-[#757576] bg-[#F5F5F5] rounded-full ">
              <h3 className="mx-[8px] my-[8px] text-[#757576] font-[DM_Sans] text-[14px] not-italic font-medium leading-[19.135px]">Burger</h3>
            </button>
            </div>
          </div>
        </div> */}


        {/* Suggetion */}

        <div className="w-full   flex justify-center items-center">
          <div className="w-[90%] ">
          <h1 className="text-[#2F2F2F] font-[DM_Sans] text-[18px] not-italic font-bold leading-[19.135px]">You May Like</h1>
          </div>
        </div>

      </div>
    </>
  )
};

export default Search;