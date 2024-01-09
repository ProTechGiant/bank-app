import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import Typography from "@/components/Typography";

import { ErrorMessageType } from "../types";

export function useErrorMessages(error: ApiError<ResponseError> | undefined) {
  const { t } = useTranslation();

  const getMessageFromType = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0049": {
        message: t("NafathAuthScreen.modal.failedMessage"),
        variant: "error",
      },
      "0061": {
        message: <></>,
        variant: "error",
        link: "Sign In",
      },
      "0081": {
        message: t("Onboarding.IqamaInputScreen.errorText.oneAttemptsLeft"),
        variant: "warning",
      },
      "0082": {
        message: t("Onboarding.IqamaInputScreen.errorText.twoAttemptsLeft"),
        variant: "warning",
      },
      "0083": {
        message: t("Onboarding.IqamaInputScreen.errorText.noAttemptsLeft"),
        variant: "error",
      },
      "0084": {
        message: t("Onboarding.IqamaInputScreen.errorText.noMatch"),
        variant: "error",
      },
      "0085": {
        message: t("Onboarding.IqamaInputScreen.errorText.regulatoryCheck"),
        variant: "error",
      },
      "0086": {
        message: (
          <>
            {t("Onboarding.IqamaInputScreen.errorText.hasAccount.warning")}{" "}
            <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
              {t("Onboarding.IqamaInputScreen.errorText.hasAccount.signIn")}
            </Typography.Text>
          </>
        ),
        variant: "error",
        link: "Sign In",
      },
      "0056": {
        message: (
          <>
            {t("Onboarding.IqamaInputScreen.errorText.hasAccount.warning")}{" "}
            <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
              {t("Onboarding.IqamaInputScreen.errorText.hasAccount.signIn")}
            </Typography.Text>
          </>
        ),
        variant: "error",
        link: "Sign In",
      },
      default: {
        message: t("Onboarding.IqamaInputScreen.errorText.cannotOpen"),
        variant: "error",
      },
    };

    return messages[type] || messages.default;
  };

  return { errorMessages: error?.errorContent?.Errors?.map(value => getMessageFromType(value.ErrorId)) ?? [] };
}
