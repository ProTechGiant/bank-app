import { createContext, useContext } from "react";

export type OrderCardValues = {
  cardType: number;
  cardProductId: number;
  pin: string;
};

export const orderCardInitValues: OrderCardValues = {
  cardType: 0,
  cardProductId: 0,
  pin: "",
};

export interface OrderCardContextValues {
  orderCardValues: OrderCardValues;
  setOrderCardValues: React.Dispatch<React.SetStateAction<OrderCardValues>> | null;
}

export const OrderCardContext = createContext<OrderCardContextValues>({
  orderCardValues: orderCardInitValues,
  setOrderCardValues: null,
});

export const useOrderCardContext = () => useContext(OrderCardContext);
