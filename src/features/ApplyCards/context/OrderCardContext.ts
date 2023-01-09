import { createContext, useContext } from "react";

export interface FormState {
  error?: Error;
}

export interface Address {
  addressLineOne: string;
  addressLineTwo?: string;
  district: string;
  city: string;
  postalCode: string;
}

export interface OrderCardFormValues {
  cardType: number;
  cardProductId: number;
  pin: string;
  alternateAddress?: Address;
}

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
