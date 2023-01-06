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
};

export const orderCardInitValues: OrderCardValues = {
  formValues: {
    cardType: 0,
    cardProductId: 0,
    pin: "",
  },
};

export interface OrderCardContextValues {
  orderCardValues: OrderCardValues;
  setOrderCardValues: React.Dispatch<React.SetStateAction<OrderCardValues>>;
}

export const OrderCardContext = createContext<OrderCardContextValues>({
  orderCardValues: orderCardInitValues,
  setOrderCardValues: () => {},
});

export const useOrderCardContext = () => useContext(OrderCardContext);
