import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { FeedbackRequest } from "@/types/Content";
import { generateRandomId } from "@/utils";

import { DetailsFAQResponse, FaqSearchResponse } from "../types";

export const queryKeys = {
  all: ["faqs"] as const,
  searchFAQ: (searchKeyword: string, language: string) =>
    [...queryKeys.all, "search", { searchKeyword, language }] as const,
  detailsFAQ: (faqId: string, language: string) => [...queryKeys.all, "details", { faqId, language }] as const,
};

export function useSearchFAQ(searchKeyword: string, language: string) {
  return useQuery(
    queryKeys.searchFAQ(searchKeyword, language),
    () => {
      return api<FaqSearchResponse[]>(
        "v1",
        "contents/faqs",
        "GET",
        {
          SearchKeywords: searchKeyword ? searchKeyword : null,
          Language: language,
          IncludeChildren: true,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days * 24 hours * 60 minutes * 60 second * 1000 milesecond
    }
  );
}

export function useDetailsFAQ(faqId: string, language: string) {
  const { userId } = useAuthContext();
  return useQuery(
    queryKeys.detailsFAQ(faqId, language),
    () => {
      return api<DetailsFAQResponse>(
        "v1",
        `contents/faqs/items/${faqId}`,
        "GET",
        {
          Language: language,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["CustomerId"]: userId ?? "",
        }
      );
    },
    {
      staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days * 24 hours * 60 minutes * 60 second * 1000 milesecond
    }
  );
}

export function useFeedback(faqId: string, language: string) {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation(
    (values: FeedbackRequest) => {
      return api<unknown>(
        "v1",
        `customers/${userId}/contents/feedback/${values.ContentId}`,
        "POST",
        undefined,
        values,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["CustomerId"]: userId ?? "",
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.detailsFAQ(faqId, language));
      },
    }
  );
}
