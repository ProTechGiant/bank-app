import { createContext, useContext, useMemo, useState } from "react";

export interface Address {
  AddressLineOne: string;
  AddressLineTwo?: string;
  District: string;
  City: string;
  PostalCode: string;
  Country: string;
}

export interface OrderCardFormValues {
  cardType: number;
  cardProductId: number;
  pin: string;
  alternateAddress?: Address;
}

export type OrderCardValues = {
  formValues: OrderCardFormValues;
  formState?: {
    error?: Error;
  };
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
