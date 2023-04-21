import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { cardsQueryKeys } from "@/features/CardActions/hooks/query-hooks";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import { OtpResponseStatus, ValidateOtpRequest, ValidateOtpResponse } from "../types";

type OtpScreenParams = MainStackParams["OneTimePassword.OneTimePasswordModal"];

// adds type safety to action params
interface HandleOtpParams<Route extends keyof MainStackParams, Payload> extends OtpScreenParams {
  action: {
    to: Route;
    params?: Omit<MainStackParams[Route], "otpResponseStatus">;
  };
  onFinish?: (status: OtpResponseStatus, payload: Payload) => void;
}

export function useOtpFlow<Source extends keyof MainStackParams>() {
  type OtpCallbackResponse = { otpResponseStatus?: OtpResponseStatus; otpResponsePayload: unknown };

  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, Source>>();
  const params = route.params as MainStackParams[Source] & OtpCallbackResponse;

  const responseEffectRef = useRef<((status: OtpResponseStatus, payload: unknown) => void) | undefined>(undefined);

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

export function useOtpValidation<RequestT extends object, ResponseT extends object>() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ otpFormType, OtpId, OtpCode, correlationId, optionalParams }: ValidateOtpRequest<RequestT>) => {
      let endpointPath = "";

      switch (otpFormType) {
        case "card-actions":
          endpointPath = "cards";
          break;
        case "internal-transfer":
          endpointPath = "transfers";
          break;
      }

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
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      onSettled: (_data, _error, variables, _context) => {
        if (variables.otpFormType === "card-actions" && variables.optionalParams?.CardId !== undefined) {
          queryClient.invalidateQueries(cardsQueryKeys.all());
          queryClient.invalidateQueries(cardsQueryKeys.settings(variables.optionalParams.CardId));
        }
      },
    }
  );
}
