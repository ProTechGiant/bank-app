import { useMutation } from "react-query";

export function useIvrWaitingApi(onApiCall: () => Promise<unknown>) {
  return useMutation(onApiCall);
}
