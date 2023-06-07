import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon, InfoFilledCircleIcon } from "@/assets/icons";

import { ErrorMessageType } from "../types";

export function useErrorMessages(err: ApiError) {
  const { t } = useTranslation();

  const getErrorMessages = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0004": {
        message: t("SignIn.IqamaInputScreen.errorText.somethingWentWrong"),
        icon: <ErrorFilledCircleIcon />,
        variant: "error",
        link: "Sign In",
      },
      "0011": {
        message: t("SignIn.IqamaInputScreen.errorText.oneAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        variant: "default",
      },
      "0012": {
        message: t("SignIn.IqamaInputScreen.errorText.twoAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        variant: "default",
      },
      "0009": {
        title: t("SignIn.IqamaInputScreen.errorText.modalTitle"),
        modalMessage: t("SignIn.IqamaInputScreen.errorText.modalMessage"),
      },
      "0010": {
        title: t("SignIn.IqamaInputScreen.errorText.modalTitle"),
        modalMessage: t("SignIn.IqamaInputScreen.errorText.modalMessage"),
      },
      "0084": {
        message: t("SignIn.IqamaInputScreen.errorText.noMatch"),
        icon: <ErrorFilledCircleIcon />,
        variant: "error",
      },
      "0085": {
        message: t("SignIn.IqamaInputScreen.errorText.regulatoryCheck"),
        icon: <ErrorFilledCircleIcon />,
        variant: "error",
      },
      // Below error codes is for validate pin api in forget password screen
      "0030": {
        message: t("SignIn.ForgotPasscodeScreen.twoAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        variant: "default",
      },
      "0031": {
        message: t("SignIn.ForgotPasscodeScreen.oneAttemptLeft"),
        icon: <InfoFilledCircleIcon />,
        variant: "default",
      },
      "0032": {
        modalMessage: t("SignIn.ForgotPasscodeScreen.errorMessage"),
        title: t("SignIn.ForgotPasscodeScreen.errorTitle"),
      },
      default: {
        message: t("SignIn.IqamaInputScreen.errorText.noAccount"),
        icon: <ErrorFilledCircleIcon />,
        variant: "error",
      },
    };
    return messages[type] || messages.default;
  };
  const errorMessages = err
    ? err.errorContent && err.errorContent?.Errors
      ? err.errorContent.Errors?.map(item => {
          if (item.ErrorId) {
            return getErrorMessages(item.ErrorId);
          } else {
            return getErrorMessages("9090");
          }
        })
      : [
          {
            message: t("SignIn.IqamaInputScreen.errorText.somethingWentWrong"),
            title: t("SignIn.IqamaInputScreen.errorText.somethingWentWrongModalTitle"),
            modalMessage: t("SignIn.IqamaInputScreen.errorText.somethingWentWrongModalMessage"),
            icon: <ErrorFilledCircleIcon />,
            variant: "error",
          },
        ]
    : [];
  return { errorMessages };
}
