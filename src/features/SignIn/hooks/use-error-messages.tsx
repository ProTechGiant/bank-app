import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import { ErrorFilledCircleIcon, InfoFilledCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";

import { ErrorMessageType } from "../types";

export function useErrorMessages(err: ApiError<ResponseError>) {
  const { t } = useTranslation();

  const getErrorMessages = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0061": {
        message: <></>,
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
        link: "Sign In",
      },
      "0081": {
        message: t("Onboarding.IqamaInputScreen.errorText.oneAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        color: "warningBase-30",
      },
      "0082": {
        message: t("Onboarding.IqamaInputScreen.errorText.twoAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        color: "warningBase-30",
      },
      "0083": {
        message: t("Onboarding.IqamaInputScreen.errorText.noAttemptsLeft"),
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
      },
      "0084": {
        message: t("Onboarding.IqamaInputScreen.errorText.noMatch"),
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
      },
      "0085": {
        message: t("Onboarding.IqamaInputScreen.errorText.regulatoryCheck"),
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
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
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
        link: "Sign In",
      },
      default: {
        message: t("Onboarding.IqamaInputScreen.errorText.cannotOpen"),
        icon: <ErrorFilledCircleIcon />,
        color: "errorBase-30",
      },
    };
    return messages[type] || messages.default;
  };

  const errorMessages =
    err && err.errorContent && err.errorContent?.Errors
      ? err.errorContent.Errors?.map(({ ErrorId }: { ErrorId: string }) => getErrorMessages(ErrorId))
      : [];

  return { errorMessages };
}
