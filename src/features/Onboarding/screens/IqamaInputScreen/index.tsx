import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { SvgProps } from "react-native-svg";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon, IconProps, InfoFilledCircleIcon } from "@/assets/icons";
import { BannerColorType } from "@/components/Banner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import ApiOnboardingError from "../../types/ApiOnboardingError";
import IqamaInputs from "./IqamaInputs";
import MobileAndNationalIdForm from "./MobileAndNationalId/MobileAndNationalIdForm";
import useIqama from "./use-iqama";
import { IqamaError } from "./use-submit-iqama";
export interface ErrorMessageType {
  message: string | JSX.Element;
  icon: React.ReactElement<SvgProps | IconProps>;
  backgroundColor: BannerColorType;
  link?: string;
}

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const [errorMessages, setErrorsMessages] = useState<ErrorMessageType[]>([]);
  const { mutateAsync, error } = useIqama();
  const navigation = useNavigation();
  // const submitIqamaError = error as IqamaError;

  const handleOnSignIn = () => {
    Alert.alert("signin button pressed");
  };

  const getErrorMessages = (type: string) => {
    const messages: { [key: string]: ErrorMessageType } = {
      "0001": {
        message: t("Onboarding.IqamaInputScreen.errorText.twoAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        backgroundColor: "tintBase-30",
      },
      "0002": {
        message: t("Onboarding.IqamaInputScreen.errorText.oneAttemptsLeft"),
        icon: <InfoFilledCircleIcon />,
        backgroundColor: "tintBase-30",
      },
      "0003": {
        message: t("Onboarding.IqamaInputScreen.errorText.noAttemptsLeft"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0004": {
        message: t("Onboarding.IqamaInputScreen.errorText.noMatch"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0005": {
        message: t("Onboarding.IqamaInputScreen.errorText.cannotOpen"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0006": {
        message: t("Onboarding.IqamaInputScreen.errorText.regulatoryCheck"),
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
      "0007": {
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
        message: "You cannot open an account this time",
        icon: <ErrorFilledCircleIcon />,
        backgroundColor: "errorBase-40",
      },
    };
    return messages[type] || messages["default"];
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      await mutateAsync(values);
      navigation.navigate("Onboarding.Nafath");
    } catch (error) {
      Alert.alert(
        "Sorry, could not complete your request",
        error instanceof ApiError<ApiOnboardingError> ? error.errorContent.Message : undefined
      );
      // setErrorsMessages(submitIqamaError.errorContent.Errors.map(err => getErrorMessages(err.ErrorCode)));
      setErrorsMessages([getErrorMessages("0001")]);
    }
  };

  return (
    <Page>
      <NavHeader title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} right="close" />

      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSigninPress={handleOnSignIn} />
    </Page>
  );
}
