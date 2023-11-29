import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon } from "@/assets/icons";

import { ErrorMessageType } from "../types";

export function useConfrimPasscodeErrorMessages(err: ApiError) {
  const { t } = useTranslation();

  const getErrorMessages = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0004": {
        message: t("SignIn.IqamaInputScreen.errorText.samePasscode"),
        icon: <ErrorFilledCircleIcon />,
        variant: "error",
        link: "Sign In",
      },
    };
    return messages[type] || messages.default;
  };
  const errorMessages = err
    ? err.errorContent && err.errorContent?.Errors
      ? err.errorContent.Errors?.map(item => {
          if (item.ErrorId) {
            return getErrorMessages(item.ErrorId);
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
