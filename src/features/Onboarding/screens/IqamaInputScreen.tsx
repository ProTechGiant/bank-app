import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { MobileAndNationalIdForm } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useErrorMessages } from "../hooks";
import { useIqama, usePreferredLanguage } from "../hooks/query-hooks";
import { IqamaInputs } from "../types";

function getActiveTask(activeTask: string) {
  const tasks: { [key: string]: string } = {
    MobileVerification: "Onboarding.Iqama",
    RetrievePersonalDetails: "Onboarding.Nafath",
    ConfirmPersonalDetails: "Onboarding.ConfirmDetails",
    PersistEmail: "Onboarding.OptionalEmail",
    PersistFinancialInfo: "Onboarding.Financial",
    "Fatca&Crs": "Onboarding.Fatca",
    "T&C": "Onboarding.TermsAndConditions",
    WaitingEDDResult: "Onboarding.PendingAccount",
    RetryCustomerScreening: "Onboarding.PendingAccount",
    RetrieveValidationStatus: "Onboarding.PendingAccount",
    RetryAccountCreation: "Onboarding.PendingAccount",
    default: "Onboarding.Nafath",
  };
  return tasks[activeTask] || tasks.default;
}

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const { mutateAsync, error, reset } = useIqama();
  const navigation = useNavigation();
  const iqamaError = error as ApiError;
  const userPreferredLanguage = usePreferredLanguage();
  const { errorMessages } = useErrorMessages(iqamaError);
  const { fetchLatestWorkflowTask, setNationalId } = useOnboardingContext();

  const handleContinueOboarding = useCallback(async () => {
    try {
      const workflowTask = await fetchLatestWorkflowTask();
      if (workflowTask?.Name !== "MobileVerification") {
        const activeTaskScreen = workflowTask && getActiveTask(workflowTask.Name);
        navigation.navigate(activeTaskScreen);
        handlePreferredLanguage();
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
    navigation.navigate("SignIn.SignInStack");
  };

  const handlePreferredLanguage = async () => {
    try {
      //only calling userPreferredLanguage  in case customer has already started the onboarding process
      await userPreferredLanguage.mutateAsync();
    } catch (err) {
      warn("language", "Could not update PreferredLanguage. Error: ", JSON.stringify(err));
    }
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      setNationalId(String(values.NationalId));
      await mutateAsync(values);
      //TODO: TO IMPLEMENT THIS CHECK, COMMENTED FOR TESTING PURPOSE
      // if (response.IsOwner) {
      navigation.navigate("Onboarding.Nafath");
      // }
    } catch (err) {
      warn("onboarding", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} />
      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSignInPress={handleOnSignIn} />
    </Page>
  );
}
