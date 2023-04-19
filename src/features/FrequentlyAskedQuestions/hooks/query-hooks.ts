import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { faqSearchResponse } from "../types";

export const queryKeys = {
  all: ["faqs"] as const,
  searchFAQ: (searchKeyword: string) => [...queryKeys.all, { searchKeyword }] as const,
};

export function useSearchFAQ(searchKeyword: string, language: "en" | "ar") {
  return useQuery(queryKeys.searchFAQ(searchKeyword), () => {
    return api<faqSearchResponse[]>("v1", `faq/search/${searchKeyword}?ln=${language}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
