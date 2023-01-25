import { createContext, useContext } from "react";

import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";

export type homeScreenLayoutType = {
  quickActionOrderData: quickActionReorderItem[];
  homepageOrderData: ReorderItem[];
};

export type GlobalContextType = {
  homeScreenLayout: homeScreenLayoutType;
  setHomeScreenLayout: React.Dispatch<React.SetStateAction<homeScreenLayoutType>> | null;
  referralPageViewed: boolean;
  setReferralPageViewed: React.Dispatch<React.SetStateAction<boolean>>;
};
export const GlobalContext = createContext<GlobalContextType>({
  homeScreenLayout: { quickActionOrderData: [], homepageOrderData: [] },
  setHomeScreenLayout: null,
  referralPageViewed: false,
  setReferralPageViewed: () => {
    return;
  },
});
export const useGlobalContext = () => useContext(GlobalContext);
