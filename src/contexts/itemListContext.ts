import { ReorderItem } from "@/mocks/quickActionOrderData";
import { createContext, useContext } from "react";

export type ItemListContextType = {
  itemList: ReorderItem[];
  setItemList: React.Dispatch<React.SetStateAction<ReorderItem[]>> | null;
  toggleItem: ((key: string) => void) | null;
};
export const ItemListContext = createContext<ItemListContextType>({
  itemList: [],
  setItemList: null,
  toggleItem: null,
});
export const useItemListContext = () => useContext(ItemListContext);
