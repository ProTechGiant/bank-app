import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon, InfoFilledCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";

import ApiOnboardingError from "../../types/ApiOnboardingError";
import { ErrorMessageType } from ".";

export default function useErrorMessages(err: ApiError<ApiOnboardingError>) {
  const { t } = useTranslation();

  const getErrorMessages = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0081": {
        message: t("Onboarding.IqamaInputScreen.errorText.oneAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        backgroundColor: "interactionBase-30",
      },
      "0082": {
        message: t("Onboarding.IqamaInputScreen.errorText.twoAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        backgroundColor: "interactionBase-30",
      },
      "0083": {
        message: t("Onboarding.IqamaInputScreen.errorText.noAttemptsLeft"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0084": {
        message: t("Onboarding.IqamaInputScreen.errorText.noMatch"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0086": {
        message: (
          <>
            {t("Onboarding.IqamaInputScreen.errorText.hasAccount.warning")}{" "}
            <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
              {t("Onboarding.IqamaInputScreen.errorText.hasAccount.signin")}
            </Typography.Text>
          </>
        ),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
        link: "Sign In",
      },
      default: {
        message: t("Onboarding.IqamaInputScreen.errorText.cannotOpen"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
    };
    return messages[type] || messages["default"];
  };

  const errorMessages =
    err && err.errorContent && err.errorContent.Errors
      ? err.errorContent.Errors.map(({ ErrorId }: { ErrorId: string }) => getErrorMessages(ErrorId))
      : [];

  return { errorMessages };
}
