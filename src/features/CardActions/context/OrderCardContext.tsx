import { createContext, useContext, useMemo, useState } from "react";

import { PHYSICAL_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { OrderCardFormValues } from "@/types/Address";

type OrderCardValues = {
  formValues: OrderCardFormValues;
  formState?: {
    error?: Error;
  };
};

const orderCardInitValues: OrderCardValues = {
  formValues: {
    CardType: PHYSICAL_CARD_TYPE,
    CardProductId: STANDARD_CARD_PRODUCT_ID,
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
