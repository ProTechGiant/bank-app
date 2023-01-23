import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";
import { Notification } from "@/types/notification";

export default function usePendingNotications() {
  const { data } = useQuery<Notification[]>("notifications", () => {
    return api<Notification[]>("api-dev", "v1", "customer/1/actions", "GET", undefined, undefined);
  });

  return useMemo(() => data?.filter(d => d.action_status === "pending") ?? [], [data]);
}
