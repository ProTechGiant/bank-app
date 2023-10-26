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

import { OtpResponseStatus, OtpVerifyMethodType, ValidateOtpRequest, ValidateOtpResponse } from "../types";

type AnyStack = AuthenticatedStackParams | UnAuthenticatedStackParams;
type OtpScreenParams<Stack extends AnyStack> = OneTimePasswordModalParams<Stack>;

// @ts-expect-error expected error because action.params is overwritten
interface HandleOtpParams<Stack extends AnyStack, Route extends keyof Stack, Payload> extends OtpScreenParams<Stack> {
  action: undefined extends Stack[Route]
    ? { to: Route }
    : { to: Route; params: Omit<Stack[Route], "otpResponseStatus" | "otpResponsePayload"> };
  onFinish?: (status: OtpResponseStatus, payload: Payload, errorId?: string) => void | Promise<void>;
}

export function useOtpFlow<Stack extends AnyStack>() {
  type OtpCallbackResponse = {
    otpResponseStatus?: OtpResponseStatus;
    otpResponsePayload: unknown;
    otpResponseErrorId?: string;
  };

  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<RouteProp<Stack, any>>();
  const params = route.params as unknown as OtpCallbackResponse;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseEffectRef = useRef<((status: OtpResponseStatus, payload: any, errorId?: string) => void) | undefined>(
    undefined
  );

  useEffect(() => {
    if (params?.otpResponseStatus === undefined) {
      return;
    }

    responseEffectRef.current?.(params.otpResponseStatus, params.otpResponsePayload, params.otpResponseErrorId);
  }, [params]);

  const useOtpResponseEffect = <Payload>(
    fn: (status: OtpResponseStatus, payload: Payload, errorId?: string) => void
  ) => {
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

export function useOtpValidation<RequestT, ResponseT>(method: OtpVerifyMethodType) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ OtpId, OtpCode, optionalParams }: ValidateOtpRequest<RequestT>) => {
      // We have two endpoints here one is for Login Flow (customers/otps/validate) and other(/otp-validation) is related to cards and transaction flow.
      // we are using method to get complete otherEndpoint for cards and transaction flow
      const endpointPath =
        method === "card-actions" ? "cards" : method === "payments/sadad" ? "payments/sadad" : "transfers";
      const otherEndpoint = `${endpointPath}/otp-validation`;
      const loginEndpoint = "customers/otps/validate";

      const isLoginFlow =
        method === "login" ||
        method === "reset-passcode" ||
        method === "change-passcode" ||
        method === "create-passcode" ||
        method === "register-email" ||
        method === "link-proxy-alias" ||
        method === "optout-proxy-alias";

      const isSadadFlow = method === "payments/sadad";
      const isCardsFlow = method === "card-actions";

      let endpoint = isLoginFlow ? loginEndpoint : otherEndpoint;
      const requestParam = isLoginFlow
        ? { OtpId: OtpId, OtpCode: OtpCode, Reason: method }
        : isSadadFlow
        ? {
            OtpId: OtpId,
            OtpCode: OtpCode,
          }
        : isCardsFlow
        ? {
            OtpId: OtpId,
            OtpCode: OtpCode,
          }
        : {
            data: {
              // TODO:- This will updated once IVR integrated.
              IvrUserPressed: 1,
              OtpId: OtpId,
            },
            OtpCode: OtpCode,
            Reason: method,
          };
      // TODO: "customers/communication-details" api should be updated from BE team to match above endpoints (response and request types)
      // TODO: also should be the same http method (POST)
      // TODO: also the NumOfAttempts is not returned with the response which used to disable keyboard when max attempts reached till user tap resend code. => (OneTimePasswordModal.tsx)
      if (method === "customers/communication-details") {
        return api<ValidateOtpResponse & ResponseT>(
          "v2",
          method,
          "PATCH",
          undefined,
          {
            SpecifiedOtp: OtpCode,
            ...optionalParams,
          },
          {
            ["x-correlation-id"]: generateRandomId(),
            ["x-device-id"]: DeviceInfo.getDeviceId(),
            ["Authorization"]: generateRandomId(), // TODO: This should come from Auth Context
          }
        );
      }

      if (method === "goals/submit") {
        endpoint = "goals/submit";
        // TODO: remove this mock once api ready from BE team
        return Promise.resolve({
          Status: "OTP_MATCH_SUCCESS",
          NumberOfAttempts: 0,
        });
      }

      if (method === "mutual-fund/otp-validation") {
        endpoint = "mutual-fund/otp-validation";
        // TODO: remove this mock once api ready from BE team
        return Promise.resolve({
          Status: "OTP_MATCH_SUCCESS",
          NumberOfAttempts: 0,
        });
      }

      if (method === "aio-card/issuance/otp-validation") {
        endpoint = "aio-card/issuance/otp-validation";
        // TODO: remove this mock once api ready from BE team
        return Promise.resolve({
          Status: "OTP_MATCH_SUCCESS",
          NumberOfAttempts: 0,
        });
      }

      return api<ValidateOtpResponse & ResponseT>(
        "v2",
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
