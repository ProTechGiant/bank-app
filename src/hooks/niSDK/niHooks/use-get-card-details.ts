import { useState } from "react";

import NICardManagementSDKModule from "../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../niSdk/utils/formatInput";
import { NIErrorResponse, NIGetCardSuccessResponse, NIInputInterface } from "../types";

export const useGetCardDetails = () => {
  const [result, setResult] = useState<NIGetCardSuccessResponse>();
  const [error, setError] = useState<NIErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onGetCardDetails = (input: NIInputInterface) => {
    setIsLoading(true);
    setResult(undefined);
    setError(null);
    NICardManagementSDKModule.getCardDetails(formatInput(input), (err, res) => {
      setIsLoading(false);
      if (err) {
        setError(err);
        setResult(undefined);
      } else if (res) {
        setResult(res);
        setError(null);
      }
    });
  };

  return { result, error, isLoading, onGetCardDetails };
};
