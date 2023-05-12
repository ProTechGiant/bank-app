import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys as cardQueryKeys } from "@/features/CardActions/hooks/query-hooks";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { OtpResponseStatus, ValidateOtpRequest, ValidateOtpResponse } from "../types";

type OtpScreenParams = MainStackParams["OneTimePassword.OneTimePasswordModal"];

interface HandleOtpParams<Route extends keyof MainStackParams, Payload> extends OtpScreenParams {
  action: {
    to: Route;
    params: Omit<MainStackParams[Route], "otpResponseStatus">;
  };
  onFinish?: (status: OtpResponseStatus, payload: Payload) => void;
}

export function useOtpFlow<Source extends keyof MainStackParams>() {
  type OtpCallbackResponse = { otpResponseStatus?: OtpResponseStatus; otpResponsePayload: unknown };

  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, Source>>();
  const params = route.params as MainStackParams[Source] & OtpCallbackResponse;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseEffectRef = useRef<((status: OtpResponseStatus, payload: any) => void) | undefined>(undefined);

  useEffect(() => {
    if (params?.otpResponseStatus === undefined) {
      return;
    }

    responseEffectRef.current?.(params.otpResponseStatus, params.otpResponsePayload);
  }, [params]);

  const useOtpResponseEffect = <Payload>(fn: (status: OtpResponseStatus, payload: Payload) => void) => {
    responseEffectRef.current = fn;
  };

  const handle = <Payload, Destination extends keyof MainStackParams = keyof MainStackParams>({
    onFinish,
    ...input
  }: HandleOtpParams<Destination, Payload>) => {
    if (onFinish !== undefined) responseEffectRef.current = onFinish;
    navigation.navigate("OneTimePassword.OneTimePasswordModal", input);
  };

  return { handle, useOtpResponseEffect };
}

export function useOtpValidation<RequestT, ResponseT>(
  method: "card-actions" | "internal-transfers" | "quick-transfers"
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ OtpId, OtpCode, optionalParams }: ValidateOtpRequest<RequestT>) => {
      const endpointPath = method === "card-actions" ? "cards" : "transfers";

      return api<ValidateOtpResponse & ResponseT>(
        "v1",
        `${endpointPath}/otp-validation`,
        "POST",
        undefined,
        {
          ...optionalParams,
          OtpId: OtpId,
          OtpCode: OtpCode,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSettled: (_data, _error, variables, _context) => {
        if (method === "card-actions" && variables.optionalParams?.CardId !== undefined) {
          queryClient.invalidateQueries(cardQueryKeys.all()); // temporary until we have a dedicated endpoint for a specific card
          queryClient.invalidateQueries(cardQueryKeys.settings(variables.optionalParams.CardId));
        }
      },
    }
  );
}
