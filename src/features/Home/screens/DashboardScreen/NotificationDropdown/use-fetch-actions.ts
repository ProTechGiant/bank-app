import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import api from "@/api";
import { Notification } from "@/types/notification";

export const useFetchActions = () => {
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>();
  const notificationDataEndpoint = `customer/1/actions`;

  const notifications = useQuery<Notification[]>("notifications", () => {
    return api<Notification[]>("api-dev", "v1", notificationDataEndpoint, "GET", undefined, undefined);
  });

  useEffect(() => {
    if (notifications.data) {
      setPendingNotifications(notifications.data.filter(d => d.action_status === "pending"));
    }
  }, [notifications.status]);

  return { pendingNotifications };
};
