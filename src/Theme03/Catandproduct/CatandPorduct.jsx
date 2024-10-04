import React, { useState, useEffect } from 'react';
import MenuItems from '../MenuItems/MenuItems';
// import './tab.css';
import { useTranslation } from 'react-i18next';
import PromoItem from '../MenuItems/PromoItems';

function CatandProduct({ categories, dishes, setSelectedTab, selectedTab, resto, infoRes, tabel_id, customization, promo }) {
  const [t, i18n] = useTranslation('global');
  console.log("The Category With Order => ", categories.some(category => category === 'No visible categories found'));

  const filtredCategoy = categories.some(category => category === 'No visible categories found');
  const categoriesWithOrder = categories.filter(category => category.orderCategorie !== undefined);
  categoriesWithOrder.sort((a, b) => a.orderCategorie - b.orderCategorie);

  console.log("The Filtred Categories => ", categoriesWithOrder);
  return (

      <div>
        <h1 className='text-base font-bold	 ml-6'>Categories</h1>
             <div className={`overflow-x-auto  pl-4  ${infoRes.language === 'ar' ? 'rtl' : 'ltr'}`} >
               <div className={` flex   ${infoRes.language === 'ar' ? 'justify-content-end flex-row-reverse' : 'justify-content-start'} 2xl:justify-center gap-4 mb-1`}>
                <div className="relative shadow-md rounded-xl border-gray-300 border inline-block ">
                  <div
                     className={`tab flex items-center w-[90px] justify-center  h-9 pl-1.5 pr-2.5 font-semibold rounded-[8px] cursor-pointer transition-colors`}
                     style={{
                       backgroundColor: selectedTab === 'All' ? 'red' : 'white',
                       color: selectedTab === 'All' ? 'white' : 'black'
                    }}
                    onClick={() => setSelectedTab('All')}
                    role="button"
                   aria-selected={selectedTab === 'All'}
                    tabIndex={0}
                    >
                    <h2 className="text-[14px] mb-0">{t('menu.all')}</h2>
                  </div>
                </div>

                {!filtredCategoy && categoriesWithOrder.map((item) => (
                  <div key={item.id} className="relative  rounded-xl border-gray-300 border inline-block">
                    <div
                         onClick={() => setSelectedTab(item.name)}
                         className={` tab flex items-center focus:bg-[red] w-[90px] justify-center h-9 pl-1.5 pr-2.5 font-semibold rounded-[8px] cursor-pointer transition-colors`}
                       role="button"
                      aria-selected={selectedTab === item.name}
                      tabIndex={0}
                      >
                      <h2 className="text-[14px] mb-0 whitespace-nowrap" >{item.name}</h2>
                    </div>
                  </div>
                ))}



              </div>
            </div>

          <h1 className='text-base font-bold ml-6'>Product</h1>
            <MenuItems
              dishes={Array.isArray(dishes) && dishes.length > 0
                ? dishes.filter(dish => selectedTab === 'All' || (dish.categorie && dish.categorie.name === selectedTab))
                : []}
              restoId={resto}
              infoRes={infoRes}
              selectedTab={selectedTab}
              tabel_id={tabel_id}
              customization={customization}
            />
      </div>
  );
}

export default CatandProduct;