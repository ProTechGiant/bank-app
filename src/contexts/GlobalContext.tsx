import { createContext, useContext, useState } from "react";

interface GlobalContextType {
  showAccountBalance: boolean;
  setShowAccountBalance: React.Dispatch<React.SetStateAction<boolean>>;
  referralPageViewed: boolean;
  setReferralPageViewed: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType>({
  showAccountBalance: true,
  setShowAccountBalance: () => {
    return;
  },
  referralPageViewed: false,
  setReferralPageViewed: () => {
    return;
  },
});

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [referralPageViewed, setReferralPageViewed] = useState(false);
  const [showAccountBalance, setShowAccountBalance] = useState(true);

  return (
    <GlobalContext.Provider
      value={{
        referralPageViewed,
        setReferralPageViewed,
        showAccountBalance,
        setShowAccountBalance,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContextProvider, useGlobalContext };
