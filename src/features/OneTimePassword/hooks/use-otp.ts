import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";

import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import { OtpResponseStatus } from "../types";

type OtpScreenParams = MainStackParams["OneTimePassword.OneTimePasswordModal"];

// adds type safety to action params
interface HandleOtpParams<Route extends keyof MainStackParams, Payload> extends OtpScreenParams {
  action: {
    to: Route;
    params?: Omit<MainStackParams[Route], "otpResponseStatus">;
  };
  onFinish?: (status: OtpResponseStatus, payload: Payload) => void;
}

export default function useOtpFlow<Source extends keyof MainStackParams>() {
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
