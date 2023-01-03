import { createContext, useContext } from "react";

export interface FormState {
  isLoading: boolean;
  error?: Error;
}

export type OrderCardFormValues = {
  cardType: number;
  cardProductId: number;
  pin: string;
};

export type OrderCardValues = {
  formValues: OrderCardFormValues;
  formState?: FormState;
  createCardPinMode: "input" | "confirm";
};

export const orderCardInitValues: OrderCardValues = {
  formValues: {
    cardType: 0,
    cardProductId: 0,
    pin: "",
  },
  createCardPinMode: "input",
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
