import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { TermsAndConditionContainer } from "@/types/Content";
import { generateRandomId } from "@/utils";

import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import {
  CustomerGoal,
  GetProductContributionResponse,
  GoalBalanceAndContribution,
  GoalBalanceAndContributionResponse,
  GoalGetterProductResponse,
  GoalRoundUpStatus,
  GoalRoundUpStatusResponse,
  GoalSetting,
  ImageGalleryResponse,
  MutualFund,
  PredefinedGoalNames,
  PredefinedOptions,
  SavingPotCategoryId,
} from "../types";

const queryKeys = {
  getTermsAndConditionsPdf: () => ["termsAndConditionsPdf"],
  imageGallery: () => ["imageGallery"],
  predefined: (type: string, predefinedGoalId: number) => ["predefinedGoal", type, predefinedGoalId],
  getCustomersGoals: () => ["getCustomersGoals"],
  predefinedGoals: () => ["predefinedGoals"],
  predefinedRisks: (predefinedGoalId: number) => ["predefinedRisks", predefinedGoalId],
  goalsSettings: () => ["goalsSettings"],
  goalsDetails: () => ["goalsDetails"],
  mutualFund: () => ["mutualFund"],
  savingPotCategoryId: () => ["savingPotCategoryId"],
  goalGetterProducts: () => ["goalGetterProducts"],
  getGetProductContribution: () => ["getGetProductContribution"],
};

export function useGetTermsAndConditions(productId?: string) {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getTermsAndConditionsPdf(), () => {
    return api<{ TermsAndConditions: TermsAndConditionContainer }>(
      "v1",
      `goals/product/${productId}/terms-and-conditions`,
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
    return api<OtpChallengeParams>("v1", "goals/otp", "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
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

export function useGoalsSetting() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.goalsSettings(), () => {
    return api<GoalSetting>("v1", `goals/settings`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useGoalsDetails() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.goalsDetails(), () => {
    return api("v1", `goals/goal-details`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useMutualFund(productId?: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.mutualFund(), () => {
    return api<MutualFund>("v1", `goals/mutual-details/${productId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useSavingPotCategoryId() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.savingPotCategoryId(), () => {
    return api<SavingPotCategoryId>("v1", `goals/saving-pot-details`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useGoalGetterProducts(goalDuration: string, targetAmount: string, monthlyContribution: string) {
  const { i18n } = useTranslation();
  const { setGoalContextState } = useGoalGetterContext();

  return useQuery(
    queryKeys.goalGetterProducts(),
    () => {
      return api<GoalGetterProductResponse>(
        "v1",
        `goals/products?targetAmount=${targetAmount}&duration=${goalDuration}&monthlyContribution=${monthlyContribution}`,
        "GET",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    {
      onSuccess: data => {
        if (data.ValidCalculation) {
          setGoalContextState({
            TargetAmount: data.TargetAmount,
            MonthlyContribution: data.MonthlyContribution,
            Duration: data.Duration,
            ValidCalculation: data.ValidCalculation,
          });
        } else {
          setGoalContextState({
            TargetAmount: Number(targetAmount),
            MonthlyContribution: data.MonthlyContribution,
            Duration: Math.round(Number(targetAmount) / data.MonthlyContribution),
            ValidCalculation: data.ValidCalculation,
          });
        }
      },
    }
  );
}

export function useGetProductContribution(productId?: string) {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getGetProductContribution(), () => {
    return api<GetProductContributionResponse>(
      "v1",
      `goals/product/${productId}/contribution`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
        ["userId"]: "100134", // TODO: remove this id once BE team fix api
      }
    );
  });
}
