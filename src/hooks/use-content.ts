import { useQuery } from "react-query";

import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { Content, ContentCategories } from "../types/Content";
import { useTranslation } from "react-i18next";

const queryKeys = {
  contentList: ["contentList"] as const,
  content: ["content"] as const,
  categories: ["categories"] as const,
};

//TODO: params need to be checked and service to be used and tested once ready from BE
export function useContentArticleList(contentParentCategoryId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.contentList, () => {
    return sendApiRequest<Content[]>("v1", "content", "GET", undefined, undefined, {
      ["language"]: i18n.language,
      // ["includeChildren"]: true,
      ["ContentCategoryId"]: contentParentCategoryId,
    });
  });
}

//TODO: params need to be checked and service to be used and tested once ready from BE
export function useContentArticle(contentParentCategoryId: string, contentId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.content, () => {
    return sendApiRequest<Content>("v1", `content/${contentId}`, "GET", undefined, undefined, {
      ["language"]: i18n.language,
      // ["includeChildren"]: true,
      ["ContentCategoryId"]: contentParentCategoryId,
    });
  });
}

//TODO: params need to be checked and service to be used and tested once ready from BE
export function useContentArticleCategories() {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.categories,
    () => {
      return sendApiRequest<ContentCategories[]>("v1", "content/categories", "GET", undefined, undefined, {
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
