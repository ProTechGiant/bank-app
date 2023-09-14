import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { NotificationsResponseType } from "../types";

export const queryKeys = {
  all: ["notifications"] as const,
  notifications: (pageSize: number, pageNumber: number, fromDate: string, toDate: string) =>
    [...queryKeys.all, "notifications", pageSize, pageNumber, fromDate, toDate] as const,
};

export function useAllNotifications(pageSize: number, pageNumber: number, fromDate: string, toDate: string) {
  const { userId } = useAuthContext();
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.notifications(pageSize, pageNumber, fromDate, toDate),
    () => {
      return api<NotificationsResponseType>(
        "v1",
        "notifications",
        "GET",
        {
          CustomerId: userId,
          PageSize: pageSize,
          Offset: pageNumber,
          fromDate: fromDate,
          toDate: toDate,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    {
      select: data => ({
        SubCategories: data.SubCategories?.map(subCategory => ({ ...subCategory, isActive: false })) ?? [],
        Notifications:
          data.Notifications?.map(object => ({
            ...object,
            CreatedOn: new Date(object.CreatedOn),
          })) ?? [],
      }),
    }
  );
}

export function useFilterNotifications(
  pageSize: number,
  pageNumber: number,
  fromDate: string,
  toDate: string,
  subCategoryId: string
) {
  const { userId } = useAuthContext();
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.notifications(pageSize, pageNumber, fromDate, toDate),
    () => {
      return api<NotificationsResponseType>(
        "v1",
        "notifications/filter",
        "GET",
        {
          CustomerId: userId,
          PageSize: pageSize,
          Offset: pageNumber,
          fromDate: fromDate,
          toDate: toDate,
          SubCategoryId: subCategoryId,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    {
      enabled: false,
      select: notifications => ({
        ...notifications,
        Notifications:
          notifications.Notifications?.map(object => ({
            ...object,
            CreatedOn: new Date(object.CreatedOn),
          })) ?? [],
      }),
    }
  );
}
