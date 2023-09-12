/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UseQueryResult } from "react-query";

import { warn } from "@/logger";

import {
  HomepageLayoutType,
  useHomepageLayout,
  usePostHomepageLayout,
  usePostQuickActions,
  useQuickActions,
} from "../hooks/query-hooks";
import { HomepageItemLayoutType } from "../types";
import { ShortcutType } from "./../types";

interface HomepageLayoutOrderContextProps {
  quickActions: ShortcutType[];
  setQuickActions: (value: ShortcutType[]) => void;
  sections: HomepageItemLayoutType[];
  setSections: (value: HomepageItemLayoutType[]) => void;
  homepageLayout: UseQueryResult<HomepageLayoutType, unknown> | undefined;
}

const HomepageLayoutOrderContext = createContext<HomepageLayoutOrderContextProps>({
  quickActions: [],
  setQuickActions: () => {
    // ..
  },
  sections: [],
  setSections: () => {
    // ..
  },
  homepageLayout: undefined,
});

export function HomepageLayoutOrderContextProvider({ children }: React.PropsWithChildren) {
  const homepageLayout = useHomepageLayout();
  const postHomepageLayout = usePostHomepageLayout();
  const quickActions = useQuickActions();
  const postQuickActions = usePostQuickActions();

  const [state, setState] = useState<Pick<HomepageLayoutOrderContextProps, "quickActions" | "sections">>({
    quickActions: [],
    sections: [],
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, quickActions: quickActions.data?.Homepage.Sections.Shortcuts || [] }));
  }, [quickActions.data]);

  useEffect(() => {
    homepageLayout.data?.tabs?.forEach(data => {
      data.sections.forEach(section => {
        if (section.name === "Homepage Layout") {
          setState(prevState => ({
            ...prevState,
            sections: section.widgets,
          }));
        }
      });
    });
  }, [homepageLayout.data]);

  const handleOnSetQuickActions = async (value: ShortcutType[]) => {
    setState(current => ({ ...current, quickActions: value }));
    try {
      await postQuickActions.mutateAsync({
        values: {
          Homepage: {
            Sections: {
              Shortcuts: value,
            },
          },
        },
      });
    } catch (err) {
      warn("homepage", "Could not post quick actions", JSON.stringify(err));
    }
  };

  const handleOnSetSections = async (value: HomepageItemLayoutType[]) => {
    setState(current => ({ ...current, sections: value }));

    try {
      if (state.sections && state.quickActions) {
        await postHomepageLayout.mutateAsync({
          values: {
            tabs: [
              {
                name: "Homepage",
                sections: [{ name: "Homepage Layout", widgets: value }],
              },
            ],
          },
        });
      }
    } catch (err) {
      warn("Homepage layout", "Could not post new homepage layout", JSON.stringify(err));
    }
  };

  return (
    <HomepageLayoutOrderContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setQuickActions: handleOnSetQuickActions,
          setSections: handleOnSetSections,
          homepageLayout,
        }),
        [state, handleOnSetQuickActions, handleOnSetSections, homepageLayout]
      )}>
      {children}
    </HomepageLayoutOrderContext.Provider>
  );
}

export function useHomepageLayoutOrder() {
  return useContext(HomepageLayoutOrderContext);
}
