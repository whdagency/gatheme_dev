import React from 'react'
import Theme01 from './Theme01/App'
import Theme02 from './Theme02/App'
import { useMenu } from './hooks/useMenu';
function App() {
  const {
    customization,
    restos,
    resInfo,
    dishes,
    categories,
    selectedTab,
    setSelectedTab,
    restoSlug,
  } = useMenu();    
  return (
    <>
    {
      customization?.selectedTheme == 1
      ?
      <Theme01/>
      :
    <Theme02/>
   }
    </>
    // <Theme02/>
  )
}

export default App