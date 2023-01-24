import { createContext, useContext } from "react";

import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";

export type ItemListContextType = {
  itemList: quickActionReorderItem[] | ReorderItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItemList: React.Dispatch<React.SetStateAction<any>>;
  toggleItem: ((key: string) => void) | null;
};
export const ItemListContext = createContext<ItemListContextType>({
  itemList: [],
  setItemList: () => {
    return;
  },
  toggleItem: null,
});
export const useItemListContext = () => useContext(ItemListContext);
