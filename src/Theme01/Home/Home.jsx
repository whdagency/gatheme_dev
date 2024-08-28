import React from 'react'
import Banner from '../Banner/Banner'
import Tab from '../Tabs/Tab'
import Footer from '../Footer/Footerv2'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  promo
}) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const [t, i18n] = useTranslation("global");
  return (
    < >
      <Banner customization={filteredTheme} items={restos} infoRes={resInfo} />
      <Tab promo={promo} infoRes={resInfo} filteredCategories={filteredCategories} customization={filteredTheme} categories={categories} resto={restoId} tabel_id={extraInfo} dishes={dishes} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Footer slug={restoSlug} customization={filteredTheme} table_id={extraInfo} infoRes={resInfo} />

    </>


  )
}

export default Home