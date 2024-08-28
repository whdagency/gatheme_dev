import React, { useEffect, useState } from 'react';
import Theme01 from './Theme01/App';
import Theme02 from './Theme02/App';
import { useMenu } from './hooks/useMenu';
import ExpiredSubscriptionCard from './Renew/expired-subscription-card';
import SplashScreen from './components/ui/splash-screen';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <>
      {isActive ? (
        customization?.selectedTheme == 1 ? (
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
