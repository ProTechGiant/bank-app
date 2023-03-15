import { createContext, useContext, useMemo, useState } from "react";

import { OrderCardFormValues } from "@/types/Address";

export type OrderCardValues = {
  formValues: OrderCardFormValues;
  formState?: {
    error?: Error;
  };
};

export const orderCardInitValues: OrderCardValues = {
  formValues: {
    CardType: 0,
    CardProductId: 0,
    Pin: "",
  },
};

export interface OrderCardContextValues {
  orderCardValues: OrderCardValues;
  setOrderCardValues: React.Dispatch<React.SetStateAction<OrderCardValues>>;
}

export const OrderCardContext = createContext<OrderCardContextValues>({
  orderCardValues: orderCardInitValues,
  setOrderCardValues: () => {
    return;
  },
});

export const useOrderCardContext = () => useContext(OrderCardContext);

export const OrderCardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderCardValues, setOrderCardValues] = useState(orderCardInitValues);

  return (
    <OrderCardContext.Provider
      value={useMemo(
        () => ({
          orderCardValues,
          setOrderCardValues,
        }),
        [orderCardValues]
      )}>
      {children}
    </OrderCardContext.Provider>
  );
};
