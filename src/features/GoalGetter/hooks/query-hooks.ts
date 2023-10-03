import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
// TODO: remove comment when api ready from BE team
// import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { generateRandomId } from "@/utils";

import { DocumentResponse, ImageGalleryResponse, PredefinedGoalNames } from "../types";

const queryKeys = {
  all: () => ["termsAndConditions"],
  imageGallery: () => ["imageGallery"],
  predefined: (type: string, predefinedGoalId: number) => ["predefinedGoal", type, predefinedGoalId],
};

export function useGetTermsAndConditions(productId?: string) {
  return useQuery(queryKeys.all(), () => {
    return api<DocumentResponse>("v1", `goals/product/${productId}/terms-and-conditions`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useImageGallery() {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();
  return useQuery(queryKeys.imageGallery(), () => {
    return api<ImageGalleryResponse>("v1", `goals/gallery`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(), //TODO - remove toUpperCase() when api ready

      ["UserId"]: userId ?? "",
    });
  });
}

export function useGoalGetterOTP() {
  return useMutation(async () => {
    // return api<OtpChallengeParams>("v1", "goals/otp", "POST", undefined, undefined, {
    //   ["x-correlation-id"]: generateRandomId(),
    // });

    // TODO: remove this mock when api delivered from BE
    return Promise.resolve({
      OneTimePassword: {
        Length: 0,
        TimeToLive: 0,
        AllowedAttempts: 0,
      },
    });
  });
}

export function usePredefined(type: string, predefinedGoalId: number) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.predefined(type, predefinedGoalId), () => {
    return api<PredefinedGoalNames>(
      "v1",
      `goals/predefined?type=${type}&predefinedGoalId=${predefinedGoalId}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toLowerCase(),
      }
    );
  });
}
