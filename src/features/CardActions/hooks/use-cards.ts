import { useQuery } from "react-query";

import api from "@/api";

import { Card } from "../types/Card";

export default function useCards() {
  return useQuery("cards", () => {
    return api<Card[]>("v1", "cards", "GET", undefined, undefined, {
      ["x-correlation-id"]: String(Math.floor(Math.random() * 1000000000)), // Temporary: random correlation ID to avoid 502 error
    });
  });
}
