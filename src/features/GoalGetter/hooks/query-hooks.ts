import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
// TODO: remove comment when api ready from BE team
// import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { generateRandomId } from "@/utils";

import { DocumentResponse } from "../types";

const queryKeys = {
  all: () => ["termsAndConditions"],
};

export function useGetTermsAndConditions(documentId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.all(), () => {
    //TODO - change Api when TermsAndConditions will be ready
    return api<DocumentResponse>("v1", `adhoc-documents/${documentId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(), //TODO - remove toUpperCase() when api ready
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
