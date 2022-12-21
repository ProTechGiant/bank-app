import { FormState } from "@/types/form";
import { createContext, useContext } from "react";

export type OrderCardFormValues = {
  cardType: number;
  cardProductId: number;
  pin: string;
};

export type OrderCardValues = {
  formValues: OrderCardFormValues;
  formState: FormState;
};

export const orderCardInitValues: OrderCardValues = {
  formValues: {
    cardType: 0,
    cardProductId: 0,
    pin: "",
  },
  formState: {
    isLoading: false,
  },
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
