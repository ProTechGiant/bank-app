import React, { useCallback, useEffect } from "react";

import FullScreenLoader from "@/components/FullScreenLoader";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { usePreferredLanguage, useSendOnboardingOTP } from "../hooks/query-hooks";
import { getActiveTask } from "../utils/get-active-task";

export default function OnboardingOtpScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const userPreferredLanguage = usePreferredLanguage();
  const otpFlow = useOtpFlow();
  const { fetchLatestWorkflowTask, correlationId, mobileNumber } = useOnboardingContext();
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
  }, []);

  useEffect(() => {
    handleOnOtpFlow();
  }, []);
  const handleOnOtpFlow = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "Onboarding.OnboardingOtpScreen",
          correlationId: correlationId,
        },
        otpChallengeParams: {
          PhoneNumber: mobileNumber ?? "",
        },
        otpVerifyMethod: "cust_onboarding",
        onOtpRequest: () => {
          return sendOnboardingOtpMutateAsync();
        },
        onFinish: () => {
          handleContinueOboarding();
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  return <FullScreenLoader />;
}
