import { useState } from "react";

import NICardManagementSDKModule from "../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../niSdk/utils/formatInput";
import { NIErrorResponse, NIInputInterface } from "../types";

export const useChangePin = () => {
  const [result, setResult] = useState<string | null>();
  const [error, setError] = useState<NIErrorResponse | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangePin = (oldPin: string, newPin: string, input: NIInputInterface) => {
    setIsLoading(true);
    NICardManagementSDKModule.changePin(oldPin, newPin, formatInput(input), (err, res) => {
      setIsLoading(false);
      if (err) {
        setError(err);
      } else if (res) {
        setResult(res);
        setError(null);
      }
    });
  };

  return { result, error, isLoading, onChangePin };
};
