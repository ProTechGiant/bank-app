import { createContext, useContext } from "react";

import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";

export type homeScreenLayoutType = {
  quickActionOrderData: quickActionReorderItem[];
  homepageOrderData: ReorderItem[];
};

export type GlobalContextType = {
  homeScreenLayout: homeScreenLayoutType;
  setHomeScreenLayout: React.Dispatch<React.SetStateAction<homeScreenLayoutType>> | null;
};
export const GlobalContext = createContext<GlobalContextType>({
  homeScreenLayout: { quickActionOrderData: [], homepageOrderData: [] },
  setHomeScreenLayout: null,
});
export const useGlobalContext = () => useContext(GlobalContext);
