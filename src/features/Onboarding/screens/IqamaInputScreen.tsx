import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { MobileAndNationalIdForm } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useErrorMessages } from "../hooks";
import { useIqama, usePreferredLanguage, useSendOnboardingOTP } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { IqamaInputs } from "../types";
import { getActiveTask } from "../utils/get-active-task";

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { mutateAsync, error, reset } = useIqama();
  const userPreferredLanguage = usePreferredLanguage();
  const iqamaError = error as ApiError<ResponseError> | undefined;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { fetchLatestWorkflowTask, setNationalId, correlationId, setCorrelationId, mobileNumber } =
    useOnboardingContext();
  const [isNafathErrorExists, setIsNafathErrorExists] = useState<boolean>(false);
  const [isOTP, setIsOtp] = useState<boolean>(false);
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);

  const otpFlow = useOtpFlow();
  const { mutateAsync: sendOnboardingOtpMutateAsync, isLoading } = useSendOnboardingOTP();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.Iqama">>();

  const handleContinueOnboarding = useCallback(async () => {
    try {
      setIsTaskLoading(true);
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
      setIsOtp(false);
      setIsTaskLoading(false);
    } catch (err) {
      setIsOtp(false);
      setIsTaskLoading(false);
      warn("tasks", "Could not get Task. Error: ", JSON.stringify(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const correlationId = generateRandomId();
    setCorrelationId(correlationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnOtpFlow = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "Onboarding.Iqama",
          correlationId: correlationId,
          isLoading: isLoading,
        },
        otpChallengeParams: {
          PhoneNumber: mobileNumber ?? "",
        },
        otpVerifyMethod: "cust_onboarding",
        onOtpRequest: () => {
          return sendOnboardingOtpMutateAsync();
        },
        onFinish: status => {
          if (status === "success") {
            setIsOtp(true);
            handleContinueOnboarding();
          } else {
            navigation.navigate("Onboarding.Iqama");
          }
        },
      });
    } catch (responseError) {
      navigation.navigate("Onboarding.Iqama");
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  useEffect(() => {
    if (iqamaError?.errorContent?.Errors?.some(value => value.ErrorId === "0061")) {
      handleContinueOnboarding();
      reset();
    }
  }, [handleContinueOnboarding, iqamaError, reset]);

  useEffect(() => {
    if (route?.params?.nafathDetailFetchError) setIsNafathErrorExists(true);
  }, [route.params]);

  const handleOnSignIn = () => {
    navigation.navigate("SignIn.SignInStack");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      setIsNafathErrorExists(false);
      setNationalId(String(values.NationalId));

      const response = await mutateAsync(values);
      if (response?.Name === "GenerateOTP" || response?.Name === "Resend&ValidateOTP") {
        handleOnOtpFlow();
      } else {
        navigation.navigate(getActiveTask(response?.Name || ""));
      }
    } catch (err) {
      warn("onboarding", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      {isOTP ? (
        <FullScreenLoader />
      ) : (
        <>
          <NavHeader
            withBackButton
            title={t("Onboarding.IqamaInputScreen.navHeaderTitle")}
            testID="Onboarding.IqamaInputScreen:NavHeader"
          />
          <MobileAndNationalIdForm
            isNafathErrorExists={isNafathErrorExists}
            onSubmit={handleOnSubmit}
            errorMessages={errorMessages}
            onSignInPress={handleOnSignIn}
            isLoading={isTaskLoading}
          />
        </>
      )}
    </Page>
  );
}
