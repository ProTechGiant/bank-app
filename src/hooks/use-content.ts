import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import {
  Article,
  Content,
  ContentCategories,
  FeedbackRequest,
  SavingPotDetails,
  TermsAndConditionContainer,
} from "../types/Content";

export const queryKeys = {
  all: () => ["content"] as const,
  contentList: () => [...queryKeys.all(), "contentList"] as const,
  homeContentList: () => [...queryKeys.all(), "homeContentList"] as const,
  termsAndConditions: (contentCategoryId: string) =>
    [...queryKeys.all(), { contentCategoryId }, "termsAndConditions"] as const,
  categories: () => [...queryKeys.all(), "categories"] as const,
  articles: (articleId: string) => [...queryKeys.all(), { articleId }] as const,
  images: (imageURL: string) => [...queryKeys.all(), { imageURL }] as const,
  AllInOneCardTermsAndConditions: () => [...queryKeys.all(), "AllInOneCardTermsAndConditions"] as const,
  Nera: () => [...queryKeys.all(), "Nera"] as const,
  NeraPlus: () => [...queryKeys.all(), "NeraPlus"] as const,
};

const getQueryKey = ({ categoryId, isHomeArticles }: { categoryId: string; isHomeArticles: boolean }) => {
  if (categoryId === "AIO_Nera") {
    return queryKeys.Nera();
  }
  if (categoryId === "AIO_Nera_Plus") {
    return queryKeys.NeraPlus();
  }
  if (isHomeArticles) {
    return queryKeys.homeContentList();
  }
  return queryKeys.contentList();
};
export function useContentArticleList(
  categoryId: string,
  includeChildren: boolean,
  isHomeArticles: boolean,
  params?: Record<string, string | number>
) {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(
    getQueryKey({ categoryId, isHomeArticles }),
    () => {
      return sendApiRequest<Content[]>(
        "v1",
        "contents",
        "GET",
        {
          Language: i18n.language,
          IncludeChildren: includeChildren,
          ContentCategoryId: categoryId,
          ...params,
        },
        undefined,
        {
          ["x-Correlation-Id"]: generateRandomId(),
          ["CustomerId"]: userId ?? "",
        }
      );
    },
    { enabled: categoryId !== "" }
  );
}

export function useContentArticle(articleId: string) {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(queryKeys.articles(articleId), () => {
    return sendApiRequest<Article>(
      "v1",
      `contents/${articleId}?Language=${i18n.language}`,
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
        ["CustomerId"]: userId ?? "",
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
  const { userId } = useAuthContext();

  return useQuery(
    queryKeys.categories(),
    () => {
      return sendApiRequest<ContentCategories[]>("v1", "contents/categories", "GET", undefined, undefined, {
        ["language"]: i18n.language,
        ["x-correlation-id"]: generateRandomId(),
        ["CustomerId"]: userId ?? "",
      });
    },
    {
      staleTime: 1 * 60 * 60 * 24 * 1000, //one day
      cacheTime: 1 * 60 * 60 * 24 * 2 * 1000, //two days
    }
  );
}

export function useContentTermsAndCondition(ContentCategoryId = "TermsAndConditions") {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.termsAndConditions(ContentCategoryId),
    () => {
      return sendApiRequest<TermsAndConditionContainer>(
        "v1",
        "/contents/terms",
        "GET",
        { Language: i18n.language, IncludeChildren: "true", ContentCategoryId: ContentCategoryId },
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

export function useSavingPotDetails(ContentCategoryId = "SavingPotDetails") {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(queryKeys.termsAndConditions(ContentCategoryId), () => {
    return sendApiRequest<SavingPotDetails>(
      "v1",
      "/contents/",
      "GET",
      {
        Language: i18n.language,
        IncludeChildren: "true",
        ContentCategoryId: ContentCategoryId,
        sort: "asc",
      },
      undefined,

      {
        ["CustomerId"]: userId ?? "",

        ["x-Correlation-Id"]: generateRandomId(),
      }
    );
  });
}
