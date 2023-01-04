import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import agent from "@/Axios/AxiosAgent";
import { Notification } from "@/types/notification";

export const useFetchActions = () => {
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>();
  const notificationDataEndpoint = `/v1/customer/1/actions`;

  const notifications = useQuery<Notification[]>("notificaionData", () =>
    agent.SL.notification(notificationDataEndpoint)
  );

  useEffect(() => {
    if (notifications.data) {
      setPendingNotifications(notifications.data.filter(d => d.action_status === "pending"));
    }
  }, [notifications.status]);

  return { pendingNotifications };
};
