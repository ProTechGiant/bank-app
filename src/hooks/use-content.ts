import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { Article, Content, ContentCategories, FeedbackRequest, TermsAndConditionContainer } from "../types/Content";

export const queryKeys = {
  all: () => ["content"] as const,
  contentList: () => [...queryKeys.all(), "contentList"] as const,
  termsAndConditions: () => [...queryKeys.all(), "termsAndConditions"] as const,
  categories: () => [...queryKeys.all(), "categories"] as const,
  articles: (articleId: string) => [...queryKeys.all(), { articleId }] as const,
};

export function useContentArticleList(contentParentCategoryId: string, includeChildren: boolean, params?: string) {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(queryKeys.contentList(), () => {
    return sendApiRequest<Content[]>(
      "v1",
      `contents?Language=${
        i18n.language
      }&IncludeChildren=${includeChildren}&ContentCategoryId=${contentParentCategoryId}${params ? `&${params}` : ""}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["CustomerId"]: userId ?? "",
      }
    );
  });
}

export function useContentArticle(articleId: string) {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(queryKeys.articles(articleId), () => {
    return sendApiRequest<Article>(
      "v1",
      `contents/${articleId}?language=${i18n.language}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["CustomerId"]: userId ?? "",
      }
    );
  });
}

export function useContentFeedback(method: string, articleId: string) {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();

  return useMutation(
    (values: FeedbackRequest) => {
      return sendApiRequest<void>("v1", `customers/${userId}/contents/feedback`, method, undefined, values, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.articles(articleId));
      },
    }
  );
}

//TODO: service mocked, needs to be tested once actual data available (service returns all content categories with their respective ContentCategoryId)
export function useContentArticleCategories() {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.categories(),
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

export function useContentTermsAndCondition() {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.termsAndConditions(),
    () => {
      return sendApiRequest<TermsAndConditionContainer>(
        "v1",
        "/contents/terms",
        "GET",
        { Language: i18n.language, IncludeChildren: "true", ContentCategoryId: "terms" },
        undefined,
        {
          ["x-Correlation-Id"]: generateRandomId(),
        }
      );
    },
    {
      staleTime: 1 * 60 * 60 * 24 * 1000, //one day
      cacheTime: 1 * 60 * 60 * 24 * 2 * 1000, //two days
    }
  );
}
