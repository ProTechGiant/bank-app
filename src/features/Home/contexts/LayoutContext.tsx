import { createContext, useContext, useMemo, useState } from "react";

import { quickActionMocks, sectionMocks } from "../mocks";
import { QuickAction, Section } from "../types";

interface LayoutContextProps {
  quickActions: QuickAction[];
  setQuickActions: (value: QuickAction[]) => void;
  sections: Section[];
  setSections: (value: Section[]) => void;
}

const LayoutContext = createContext<LayoutContextProps>({
  quickActions: [],
  setQuickActions: () => {
    // ..
  },
  sections: [],
  setSections: () => {
    // ..
  },
});

export function LayoutContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<Pick<LayoutContextProps, "quickActions" | "sections">>({
    quickActions: quickActionMocks,
    sections: sectionMocks,
  });

  const handleOnSetQuickActions = (value: QuickAction[]) => {
    setState(current => ({ ...current, quickActions: value }));
  };

  const handleOnSetSections = (value: Section[]) => {
    setState(current => ({ ...current, sections: value }));
  };

  return (
    <LayoutContext.Provider
      value={useMemo(
        () => ({ ...state, setQuickActions: handleOnSetQuickActions, setSections: handleOnSetSections }),
        [state]
      )}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
