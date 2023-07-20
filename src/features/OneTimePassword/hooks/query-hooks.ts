import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys as cardQueryKeys } from "@/features/CardActions/hooks/query-hooks";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import OneTimePasswordModalParams from "@/navigation/one-time-password-modal-params";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { OtpResponseStatus, ValidateOtpRequest, ValidateOtpResponse } from "../types";

type AnyStack = AuthenticatedStackParams | UnAuthenticatedStackParams;
type OtpScreenParams<Stack extends AnyStack> = OneTimePasswordModalParams<Stack>;

// @ts-expect-error expected error because action.params is overwritten
interface HandleOtpParams<Stack extends AnyStack, Route extends keyof Stack, Payload> extends OtpScreenParams<Stack> {
  action: undefined extends Stack[Route]
    ? { to: Route }
    : { to: Route; params: Omit<Stack[Route], "otpResponseStatus" | "otpResponsePayload"> };
  onFinish?: (status: OtpResponseStatus, payload: Payload) => void;
}

export function useOtpFlow<Stack extends AnyStack>() {
  type OtpCallbackResponse = { otpResponseStatus?: OtpResponseStatus; otpResponsePayload: unknown };

  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<RouteProp<Stack, any>>();
  const params = route.params as unknown as OtpCallbackResponse;

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

  const handle = <Payload, Destination extends keyof Stack = keyof Stack>({
    onFinish,
    ...input
  }: HandleOtpParams<Stack, Destination, Payload>) => {
    if (onFinish !== undefined) responseEffectRef.current = onFinish;
    navigation.navigate("OneTimePassword.OneTimePasswordModal", input);
  };

  return { handle, useOtpResponseEffect };
}

export function useOtpValidation<RequestT, ResponseT>(
  method:
    | "card-actions"
    | "internal-to-bank"
    | "login"
    | "quick-transfers"
    | "reset-passcode"
    | "change-passcode"
    | "create-passcode"
    | "croatia-to-arb"
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ OtpId, OtpCode, optionalParams }: ValidateOtpRequest<RequestT>) => {
      // We have two endpoints here one is for Login Flow and other is related to cards and transaction flow.
      const endpointPath = method === "card-actions" ? "cards" : "transfers";
      const otherEndpoint = `${endpointPath}/otp-validation`;
      const loginEndpoint = "customers/otps/validate";

      const isLoginFlow =
        method === "login" ||
        method === "reset-passcode" ||
        method === "change-passcode" ||
        method === "create-passcode";

      const endpoint = isLoginFlow ? loginEndpoint : otherEndpoint;
      const requestParam = isLoginFlow
        ? { OtpId: OtpId, OtpCode: OtpCode, Reason: method }
        : {
            data: {
              // TODO:- This will updated once IVR integrated.
              IvrUserPressed: 1,
              OtpId: OtpId,
            },
            OtpCode: OtpCode,
            Reason: method,
          };

      return api<ValidateOtpResponse & ResponseT>(
        "v1",
        endpoint,
        "POST",
        undefined,
        {
          ...optionalParams,
          ...requestParam,
        },
        { ["x-correlation-id"]: generateRandomId(), ["x-device-id"]: DeviceInfo.getDeviceId() }
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
