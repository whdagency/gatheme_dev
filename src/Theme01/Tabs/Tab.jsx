import React, { useState, useEffect } from 'react';
import MenuItems from '../MenuItems/MenuItems';
import './tab.css';
import { useTranslation } from 'react-i18next';

function Tab({ categories, dishes, setSelectedTab, selectedTab, resto, infoRes, tabel_id, customization }) {
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const filtered = categories.filter(category => category.orderCategorie !== undefined);
    filtered.sort((a, b) => a.orderCategorie - b.orderCategorie);
    setFilteredCategories(filtered);
  }, [categories]);

  const [t, i18n] = useTranslation('global');

  return (
    <div>
      <div className={` pl-4 overflow-x-auto ${infoRes.language === 'ar' ? 'rtl' : 'ltr'}`} >
        <div className={`flex ${infoRes.language === 'ar' ? 'justify-content-end flex-row-reverse' : 'justify-content-start'} md:justify-center gap-4 mb-1`}>
          <div className="relative shadow-md rounded-xl border-gray-300 border inline-block">
            <div
              className={`tab flex items-center w-[90px] justify-center h-9 pl-1.5 pr-2.5 font-semibold rounded-[8px] cursor-pointer transition-colors`}
              style={{
                backgroundColor: selectedTab === 'All' ? customization?.selectedPrimaryColor : 'transparent',
                color: selectedTab === 'All' ? customization?.selectedBgColor : customization?.selectedTextColor
              }}
              onClick={() => setSelectedTab('All')}
              role="button"
              aria-selected={selectedTab === 'All'}
              tabIndex={0}
            >
              <h2 className="text-[14px] mb-0">{t('menu.all')}</h2>
            </div>
          </div>
          {filteredCategories.map((item) => (
            <div key={item.id} className="relative shadow-md rounded-xl border-gray-300 border inline-block">
              <div
                onClick={() => setSelectedTab(item.name)}
                className={`tab flex items-center px-[35px] w-full justify-center h-9 font-semibold rounded-[8px] cursor-pointer transition-colors`}
                style={{
                  backgroundColor: selectedTab === item.name ? customization?.selectedPrimaryColor : 'transparent'
                }}
                role="button"
                aria-selected={selectedTab === item.name}
                tabIndex={0}
              >
                <h2 className="text-[14px] mb-0 whitespace-nowrap" style={{ color: selectedTab === item.name ? customization?.selectedBgColor : customization?.selectedTextColor }}>{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
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

export default Tab;
