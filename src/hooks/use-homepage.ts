import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { HomePageConfigurationResponse, PostHomePageConfigurations } from "@/types/Homepage";
import { generateRandomId } from "@/utils";

const queryKeys = {
  all: () => ["layout"],
  getConfiguration: () => [...queryKeys.all(), "getConfiguration"],
};

export function useHomeConfiguration(enabled = true) {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.getConfiguration(),
    () => {
      return api<HomePageConfigurationResponse>("v1", `mobile/homepage/configuration`, "GET", undefined, undefined, {
        ["x-Correlation-Id"]: correlationId,
        ["customerID"]: userId,
        ["Accept-Language"]: i18n.language,
      });
    },
    {
      select: data => ({
        ...data.Homepage.Sections,
        Layouts: data.Homepage.Sections.Sections.sort((a, b) =>
          a.CustomerConfiguration.SectionIndex > b.CustomerConfiguration.SectionIndex ? 1 : -1
        ),
      }),
      enabled,
    }
  );
}

export function usePostHomeConfigurations() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(
    ({ values }: { values: PostHomePageConfigurations }) => {
      return api<PostHomePageConfigurations>("v1", `mobile/homepage/configuration`, "POST", undefined, values, {
        ["x-Correlation-Id"]: correlationId,
        ["customerID"]: userId,
        ["Accept-Language"]: i18n.language,
      });
    },
    {
      onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.getConfiguration() }),
    }
  );
}
