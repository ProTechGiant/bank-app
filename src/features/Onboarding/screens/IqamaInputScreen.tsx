import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { MobileAndNationalIdForm } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useErrorMessages } from "../hooks";
import { useIqama, usePreferredLanguage } from "../hooks/query-hooks";
import { IqamaInputs } from "../types";

function getActiveTask(activeTask: string) {
  const tasks = {
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
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore explicitly checked with `in` operator
  return activeTask in tasks ? tasks[activeTask] : "Onboarding.Nafath";
}

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { mutateAsync, error, reset } = useIqama();
  const userPreferredLanguage = usePreferredLanguage();
  const iqamaError = error as ApiError<ResponseError> | undefined;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { fetchLatestWorkflowTask, setNationalId } = useOnboardingContext();

  const handleContinueOboarding = useCallback(async () => {
    try {
      const workflowTask = await fetchLatestWorkflowTask();

      if (workflowTask !== undefined && workflowTask.Name !== "MobileVerification") {
        const activeTaskScreen = getActiveTask(workflowTask.Name);
        navigation.navigate(activeTaskScreen);

        try {
          //only calling userPreferredLanguage  in case customer has already started the onboarding process
          await userPreferredLanguage.mutateAsync();
        } catch (err) {
          warn("language", "Could not update PreferredLanguage. Error: ", JSON.stringify(err));
        }
      }
    } catch (err) {
      warn("tasks", "Could not get Task. Error: ", JSON.stringify(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (iqamaError?.errorContent?.Errors.some(value => value.ErrorId === "0061")) {
      handleContinueOboarding();
      reset();
    }
  }, [handleContinueOboarding, iqamaError, reset]);

  const handleOnSignIn = () => {
    navigation.navigate("SignIn.SignInStack");
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
      <NavHeader
        withBackButton
        title={t("Onboarding.IqamaInputScreen.navHeaderTitle")}
        testID="Onboarding.IqamaInputScreen:NavHeader"
      />
      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSignInPress={handleOnSignIn} />
    </Page>
  );
}
