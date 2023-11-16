import { useState } from "react";

import NICardManagementSDKModule from "../../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../../niSdk/utils/formatInput";
import { NIErrorResponse, NIInputInterface } from "../../types";

export const useVerifyPin = () => {
  const [result, setResult] = useState<string | null>();
  const [error, setError] = useState<NIErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onVerifyPin = (pin: string, input: NIInputInterface) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    NICardManagementSDKModule.verifyPin(pin, formatInput(input), (err, res) => {
      if (err) {
        setError(err);
        setResult(null);
      } else if (res) {
        setResult(res);
        setError(null);
      }
      setIsLoading(false);
    });
  };

  return { result, error, isLoading, onVerifyPin };
};
