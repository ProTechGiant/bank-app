import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
// TODO: remove comment when api ready from BE team
// import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { generateRandomId } from "@/utils";

import {
  CustomerGoal,
  DocumentResponse,
  GoalBalanceAndContribution,
  GoalBalanceAndContributionResponse,
  GoalRoundUpStatus,
  GoalRoundUpStatusResponse,
  ImageGalleryResponse,
  PredefinedGoalNames,
  PredefinedOptions,
} from "../types";

const queryKeys = {
  getTermsAndConditionsPdf: () => ["termsAndConditionsPdf"],
  imageGallery: () => ["imageGallery"],
  predefined: (type: string, predefinedGoalId: number) => ["predefinedGoal", type, predefinedGoalId],
  getCustomersGoals: () => ["getCustomersGoals"],
  predefinedGoals: () => ["predefinedGoals"],
  predefinedRisks: (predefinedGoalId: number) => ["predefinedRisks", predefinedGoalId],
};

export function useGetTermsAndConditions(productId?: string) {
  return useQuery(queryKeys.getTermsAndConditionsPdf(), () => {
    return api<DocumentResponse>("v1", `goals/product/${productId}/terms-and-conditions`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetCustomerGoals() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.getCustomersGoals(), () => {
    return api<CustomerGoal>("v1", "goals", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
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

export function useBalanceAndContribution() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useMutation(async ({ productId, targetDate, targetAmount }: GoalBalanceAndContribution) => {
    return api<GoalBalanceAndContributionResponse>(
      "v1",
      `goals/contribution`,
      "PATCH",
      undefined,
      {
        productId,
        targetDate,
        targetAmount,
      },
      {
        ["x-correlation-id"]: correlationId,
        ["UserId"]: `${userId}`,
      }
    );
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

export function useUpdateRoundUpStatus(goalId: string) {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useMutation(async ({ values }: { values: GoalRoundUpStatus }) => {
    return api<GoalRoundUpStatusResponse>("v1", `goals/${goalId}/round-up/status`, "PATCH", undefined, values, {
      ["x-correlation-id"]: correlationId,
      ["UserId"]: `${userId}`,
    });
  });
}
export function usePredfinedGoals() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.predefinedGoals(), () => {
    return api<PredefinedOptions>("v1", `goals/predefined?type=goal&predefinedGoalId=0`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function usePredfinedRisks(predefinedGoalId: number) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.predefinedRisks(predefinedGoalId), () => {
    return api<PredefinedOptions>(
      "v1",
      `goals/predefined?type=risk&predefinedGoalId=${predefinedGoalId}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      }
    );
  });
}
