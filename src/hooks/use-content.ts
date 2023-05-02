import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { Content, ContentCategories } from "../types/Content";

const queryKeys = {
  contentList: ["contentList"] as const,
  content: ["content"] as const,
  categories: ["categories"] as const,
};

//TODO: service mocked, needs to be tested once actual data available (service gets all content for specific parent category i.e help and support)
export function useContentArticleList(contentParentCategoryId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.contentList, () => {
    return sendApiRequest<Content[]>("v1", "contents", "GET", undefined, undefined, {
      ["language"]: i18n.language,
      ["includeChildren"]: "true",
      ["ContentCategoryId"]: contentParentCategoryId,
      ["x-Correlation-Id"]: generateRandomId(),
    });
  });
}

//TODO: service mocked, needs to be tested once actual data available (service gets all content for a sepcific content type i.e. call us info in help and support )
export function useContentArticle(contentParentCategoryId: string, contentId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.content, () => {
    return sendApiRequest<Content>("v1", `contents/${contentId}`, "GET", undefined, undefined, {
      ["language"]: i18n.language,
      ["includeChildren"]: "true",
      ["ContentCategoryId"]: contentParentCategoryId,
      ["x-Correlation-Id"]: generateRandomId(),
    });
  });
}

//TODO: service mocked, needs to be tested once actual data available (service returns all content categories with their respective ContentCategoryId)
export function useContentArticleCategories() {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.categories,
    () => {
      return sendApiRequest<ContentCategories[]>("v1", "contents/categories", "GET", undefined, undefined, {
        ["language"]: i18n.language,
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      staleTime: 1 * 60 * 60 * 24 * 1000, //one day
      cacheTime: 1 * 60 * 60 * 24 * 2 * 1000, //two days
    }
  );
}
