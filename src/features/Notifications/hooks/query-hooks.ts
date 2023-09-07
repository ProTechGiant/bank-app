import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { NotificationType } from "../types";

export const queryKeys = {
  all: ["notifications"] as const,
  notifications: (pageSize: number, pageNumber: number, fromDate: Date, toDate: Date) =>
    [...queryKeys.all, "notifications", pageSize, pageNumber, fromDate, toDate] as const,
};

export function useAllNotifications(pageSize: number, pageNumber: number, fromDate: Date, toDate: Date) {
  const { userId } = useAuthContext();
  return useQuery(
    queryKeys.notifications(pageSize, pageNumber, fromDate, toDate),
    () => {
      return api<NotificationType<string>[]>(
        "v1",
        "notifications",
        "GET",
        { userId: userId, pageSize, offset: pageNumber, fromDate: fromDate.toString(), toDate: toDate.toString() },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      select: notifications => ({
        ...notifications,
        Notifications: notifications.map(object => ({
          ...object,
          CreatedOn: new Date(object.CreatedOn),
        })),
      }),
    }
  );
}
