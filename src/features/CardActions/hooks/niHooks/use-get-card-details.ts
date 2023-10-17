import { useState } from "react";

import NICardManagementSDKModule from "../../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../../niSdk/utils/formatInput";
import { NIErrorResponse, NIGetCardSuccessResponse, NIInputInterface } from "../../types";

export const useGetCardDetails = () => {
  const [result, setResult] = useState<NIGetCardSuccessResponse>();
  const [error, setError] = useState<NIErrorResponse | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onGetCardDetails = (input: NIInputInterface) => {
    setIsLoading(true);
    NICardManagementSDKModule.getCardDetails(formatInput(input), (err, res) => {
      setIsLoading(false);
      if (err) {
        setError(err);
      } else if (res) {
        setResult(res);
        setError(null);
      }
    });
  };

  return { result, error, isLoading, onGetCardDetails };
};
