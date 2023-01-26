import { createContext, useContext, useState } from "react";

import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import { homepageOrderData, quickActionOrderData } from "@/mocks/quickActionOrderData";

interface homeScreenLayoutType {
  quickActionOrderData: quickActionReorderItem[];
  homepageOrderData: ReorderItem[];
}

interface GlobalContextType {
  showAccountBalance: boolean;
  setShowAccountBalance: React.Dispatch<React.SetStateAction<boolean>>;
  homeScreenLayout: homeScreenLayoutType;
  setHomeScreenLayout: React.Dispatch<React.SetStateAction<homeScreenLayoutType>> | null;
  referralPageViewed: boolean;
  setReferralPageViewed: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType>({
  showAccountBalance: true,
  setShowAccountBalance: () => {
    return;
  },
  homeScreenLayout: { quickActionOrderData: [], homepageOrderData: [] },
  setHomeScreenLayout: () => {
    return;
  },
  referralPageViewed: false,
  setReferralPageViewed: () => {
    return;
  },
});

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [referralPageViewed, setReferralPageViewed] = useState(false);
  const [showAccountBalance, setShowAccountBalance] = useState(true);
  const [homeScreenLayout, setHomeScreenLayout] = useState({
    quickActionOrderData,
    homepageOrderData,
  });

  return (
    <GlobalContext.Provider
      value={{
        referralPageViewed,
        setReferralPageViewed,
        homeScreenLayout,
        setHomeScreenLayout,
        showAccountBalance,
        setShowAccountBalance,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContextProvider, useGlobalContext };
