import { createContext, useContext } from "react";

type Variant = "dark" | "light";

interface ListVariantContextProps {
  variant: Variant;
  children: React.ReactNode;
}

const ListContext = createContext("variant");

function ListContextProvider({ variant = "light", children }: ListVariantContextProps) {
  return <ListContext.Provider value={variant}>{children}</ListContext.Provider>;
}

const useListContext = () => useContext(ListContext);

export { ListContextProvider, useListContext };
