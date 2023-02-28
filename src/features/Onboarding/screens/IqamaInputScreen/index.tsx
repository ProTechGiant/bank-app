import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { SvgProps } from "react-native-svg";

import ApiError from "@/api/ApiError";
import { IconProps } from "@/assets/icons";
import { BannerColorType } from "@/components/Banner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

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
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);

  const handleOnSignIn = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      await mutateAsync(values);
      navigation.navigate("Onboarding.Nafath");
    } catch (error) {
      warn("onboarding", "Could not process iqama input. Error: ", JSON.stringify(error));
    }
  };

  return (
    <Page>
      <NavHeader withBackButton={true} title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} />
      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSigninPress={handleOnSignIn} />
    </Page>
  );
}
