import { useState } from "react";

import { warn } from "@/logger";

import NICardManagementSDKModule from "../../niSdk/nativeComponents/NICardManagementSDKModule";
import formatInput from "../../niSdk/utils/formatInput";
import { NIErrorResponse, NIInputInterface } from "../../types";

export const useSetPin = () => {
  const [result, setResult] = useState<string | null>();
  const [error, setError] = useState<NIErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSetPin = (pin: string, input: NIInputInterface) => {
    setIsLoading(true);
    NICardManagementSDKModule.setPin(pin, formatInput(input), (err, res) => {
      setIsLoading(false);
      if (err) {
        setError(err);
        warn("NI SET PIN -ACTIONS", `Error while setting PIN: ${JSON.stringify(err)}`);
      } else if (res) {
        setResult(res);
        setError(null);
      }
    });
  };
  return { result, error, isLoading, onSetPin };
};
