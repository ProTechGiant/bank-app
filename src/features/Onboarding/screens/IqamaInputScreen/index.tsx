import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { SvgProps } from "react-native-svg";

import ApiError from "@/api/ApiError";
import { IconProps } from "@/assets/icons";
import { BannerColorType } from "@/components/Banner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import ApiOnboardingError from "../../types/ApiOnboardingError";
import IqamaInputs from "./IqamaInputs";
import MobileAndNationalIdForm from "./MobileAndNationalId/MobileAndNationalIdForm";
import useErrorMessages from "./use-error-messages";
import useIqama from "./use-iqama";
export interface ErrorMessageType {
  message: string | JSX.Element;
  icon: React.ReactElement<SvgProps | IconProps>;
  backgroundColor: BannerColorType;
  link?: string;
}

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const { mutateAsync, error } = useIqama();
  const navigation = useNavigation();
  const iqamaError = error as ApiError<ApiOnboardingError>;
  const { errorMessages } = useErrorMessages(iqamaError);

  const handleOnSignIn = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      await mutateAsync(values);
      navigation.navigate("Onboarding.Nafath");
    } catch (err) {
      // temp as mutateAsync needs to be in a try catch
    }
  };

  return (
    <Page>
      <NavHeader title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} />

      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSigninPress={handleOnSignIn} />
    </Page>
  );
}
