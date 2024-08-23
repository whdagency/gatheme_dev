import React from 'react';
import Theme01 from './Theme01/App';
import Theme02 from './Theme02/App';
import { useMenu } from './hooks/useMenu';
import ExpiredSubscriptionCard from './Renew/expired-subscription-card';

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

  const isActive = restos?.active_resto;

  return (
    <>
      {isActive ? (
        customization?.selectedTheme === 1 ? (
          <Theme01 />
        ) : (
          <Theme02 />
        )
      ) : (
        <ExpiredSubscriptionCard />
      )}
    </>
  );
}

export default App;
