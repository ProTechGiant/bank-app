import { useState } from "react";

import NICardManagementSDKModule from "../../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../../niSdk/utils/formatInput";
import { NIErrorResponse, NIInputInterface } from "../../types";

export const useVerifyPin = () => {
  const [result, setResult] = useState<string | null>();
  const [error, setError] = useState<NIErrorResponse | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onVerifyPin = (pin: string, input: NIInputInterface) => {
    setIsLoading(true);
    NICardManagementSDKModule.verifyPin(pin, formatInput(input), (err, res) => {
      setIsLoading(false);
      if (err) {
        setError(err);
      } else if (res) {
        setResult(res);
        setError(null);
      }
    });
  };

  return { result, error, isLoading, onVerifyPin };
};
