import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { Notification } from "@/types/notification";

export default function usePendingNotications() {
  const { userId } = useAuthContext();

  const { data } = useQuery<Notification[]>("notifications", () => {
    return api<Notification[]>("v1", `customer/${userId}/actions`, "GET", undefined, undefined);
  });

  return useMemo(() => data?.filter(d => d.action_status === "pending") ?? [], [data]);
}
