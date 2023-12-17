import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

export function useGetToken() {
  return useMutation(async (id: string) => {
    return api("v2", "api/authentication", "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: id,
    });
  });
}
