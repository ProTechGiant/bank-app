import { useCallback, useEffect } from "react";
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

import { useOnboardingContext } from "../../context/OnboardingContext";
import getActiveTask from "./get-active-task";
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
  const { mutateAsync, error, reset } = useIqama();
  const navigation = useNavigation();
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { fetchLatestWorkflowTask, setNationalId } = useOnboardingContext();

  const handleContinueOboarding = useCallback(async () => {
    try {
      const workflowTask = await fetchLatestWorkflowTask();
      if (workflowTask?.Name !== "MobileVerification") {
        const activeTaskScreen = workflowTask && getActiveTask(workflowTask.Name);
        navigation.navigate(activeTaskScreen);
      }
    } catch (err) {
      warn("tasks", "Could not get Task. Error: ", JSON.stringify(err));
    }
  }, [fetchLatestWorkflowTask, navigation]);

  useEffect(() => {
    if (
      iqamaError &&
      iqamaError.errorContent &&
      iqamaError.errorContent.Errors &&
      iqamaError.errorContent.Errors.some(({ ErrorId }: { ErrorId: string }) => ErrorId === "0061")
    ) {
      handleContinueOboarding();
      reset();
    }
  }, [handleContinueOboarding, iqamaError, reset]);

  const handleOnSignIn = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      setNationalId(String(values.NationalId));
      await mutateAsync(values);
      navigation.navigate("Onboarding.Nafath");
    } catch (err) {
      warn("onboarding", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  return (
    <Page>
      <NavHeader withBackButton={true} title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} />
      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSigninPress={handleOnSignIn} />
    </Page>
  );
}
