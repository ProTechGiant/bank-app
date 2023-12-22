import { useMutation } from "react-query";

export function useIvrWaitingApi(onApiCall: () => Promise<void>) {
  return useMutation(onApiCall);
}
