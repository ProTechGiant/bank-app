import { createContext, useContext, useState } from "react";

interface TemporaryContextType {
  temporaryUserId: string;
  setTemporaryUserId: React.Dispatch<React.SetStateAction<string>>;
}

const TemporaryContext = createContext<TemporaryContextType>({
  temporaryUserId: "",
  setTemporaryUserId: () => {
    return;
  },
});

function TemporaryContextProvider({ children }: { children: React.ReactNode }) {
  const [temporaryUserId, setTemporaryUserId] = useState("");

  return (
    <TemporaryContext.Provider
      value={{
        temporaryUserId,
        setTemporaryUserId,
      }}>
      {children}
    </TemporaryContext.Provider>
  );
}

const useTemporaryContext = () => useContext(TemporaryContext);

export { TemporaryContextProvider, useTemporaryContext };
