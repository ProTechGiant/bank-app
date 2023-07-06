/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UseQueryResult } from "react-query";

import { warn } from "@/logger";

import { HomepageLayoutType, useHomepageLayout, usePostHomepageLayout } from "../hooks/query-hooks";
import { HomepageItemLayoutType } from "../types";

interface HomepageLayoutOrderContextProps {
  quickActions: HomepageItemLayoutType[];
  setQuickActions: (value: HomepageItemLayoutType[]) => void;
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

  const [state, setState] = useState<Pick<HomepageLayoutOrderContextProps, "quickActions" | "sections">>({
    quickActions: [],
    sections: [],
  });

  useEffect(() => {
    homepageLayout.data?.tabs.forEach(data => {
      data.sections.forEach(section => {
        if (section.name === "Homepage Layout") {
          setState(prevState => ({
            ...prevState,
            sections: section.widgets,
          }));
        }

        if (section.name === "Quick Actions") {
          setState(prevState => ({
            ...prevState,
            quickActions: section.widgets,
          }));
        }
      });
    });
  }, [homepageLayout.data]);

  const handleOnSetQuickActions = async (value: HomepageItemLayoutType[]) => {
    setState(current => ({ ...current, quickActions: value }));
    try {
      if (state.sections && state.quickActions) {
        await postHomepageLayout.mutateAsync({
          values: {
            tabs: [
              {
                name: "Homepage",
                sections: [
                  { name: "Homepage Layout", widgets: state.sections },
                  {
                    name: "Quick Actions",
                    widgets: value,
                  },
                ],
              },
            ],
          },
        });
      }
    } catch (err) {
      warn("homepage", "Could not get homepage layout", JSON.stringify(err));
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
                sections: [
                  { name: "Homepage Layout", widgets: value },
                  {
                    name: "Quick Actions",
                    widgets: state.quickActions,
                  },
                ],
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
