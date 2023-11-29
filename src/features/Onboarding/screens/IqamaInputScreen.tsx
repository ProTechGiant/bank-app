import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { MobileAndNationalIdForm } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useErrorMessages } from "../hooks";
import { useIqama, usePreferredLanguage, useSendOnboardingOTP } from "../hooks/query-hooks";
import { IqamaInputs } from "../types";
import { getActiveTask } from "../utils/get-active-task";

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const otpFlow = useOtpFlow();
  const { mutateAsync, error, reset } = useIqama();
  const userPreferredLanguage = usePreferredLanguage();
  const iqamaError = error as ApiError<ResponseError> | undefined;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { fetchLatestWorkflowTask, setNationalId } = useOnboardingContext();
  const { mutateAsync: sendOnboardingOtpMutateAsync } = useSendOnboardingOTP();

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
    if (iqamaError?.errorContent?.Errors?.some(value => value.ErrorId === "0061")) {
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
      const response = await mutateAsync(values);

      if (response?.Name === "GenerateOTP") {
        handleOnOtpFlow(values.MobileNumber);
      } else {
        navigation.navigate(getActiveTask(response?.Name || ""));
      }
    } catch (err) {
      warn("onboarding", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  const handleOnOtpFlow = (phoneNumber: string) => {
    try {
      otpFlow.handle({
        action: {
          to: "Onboarding.Iqama",
        },
        otpChallengeParams: {
          PhoneNumber: phoneNumber,
        },
        otpVerifyMethod: "cust_onboarding",
        onOtpRequest: () => {
          return sendOnboardingOtpMutateAsync("cust_onboarding");
        },
        onFinish: () => {
          handleContinueOboarding();
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
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
