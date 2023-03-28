import { createContext, useContext, useMemo, useState } from "react";

type ReferralPageViewStatusType = "unviewed" | "in-progress" | "finished";

interface ReferralContextType {
  referralPageViewStatus: ReferralPageViewStatusType;
  setReferralPageViewStatus: (type: ReferralPageViewStatusType) => void;
  referralLink: undefined | string;
  setReferralLink: (link: string | undefined) => void;
}

const ReferralContext = createContext<ReferralContextType>({
  referralPageViewStatus: "unviewed",
  setReferralPageViewStatus: () => {
    return;
  },
  referralLink: undefined,
  setReferralLink: () => {
    return;
  },
});

function ReferralContextProvider({ children }: { children: React.ReactNode }) {
  const [referralPageViewStatus, setReferralPageViewStatus] = useState<ReferralPageViewStatusType>("unviewed");
  const [referralLink, setReferralLink] = useState<undefined | string>(undefined);

  const contextValue = useMemo(
    () => ({
      referralPageViewStatus,
      setReferralPageViewStatus,
      referralLink,
      setReferralLink,
    }),
    [referralLink, referralPageViewStatus]
  );

  return <ReferralContext.Provider value={contextValue}>{children}</ReferralContext.Provider>;
}

function useReferralContext() {
  return useContext(ReferralContext);
}

export { ReferralContextProvider, useReferralContext };
