import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PASSCODE_LENGTH } from "../constants";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { handleOnCreatePasscode } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { getActiveTask } from "../utils/get-active-task";

type ConfirmPasscodeScreenRouteProp = RouteProp<OnboardingStackParams, "Onboarding.ConfirmPasscode">;

export default function ConfirmPasscodeScreen() {
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const { correlationId, fetchLatestWorkflowTask, mobileNumber, nationalId } = useOnboardingContext();
  const [hasValidationError, setValidationError] = useState<boolean>(false);
  const [hasAPIError, setAPIError] = useState<boolean>(false);
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const [currentValue, setCurrentValue] = useState("");

  const errorMessages = hasValidationError
    ? [
        {
          message: t("Onboarding.ConfirmPasscode.notification"),
          icon: <ErrorFilledCircleIcon />,
          variant: "warning",
        },
      ]
    : hasAPIError
    ? [
        {
          modalMessage: t("Onboarding.ConfirmPasscode.pleaseTryAgain"),
          icon: <ErrorFilledCircleIcon />,
          title: t("Onboarding.ConfirmPasscode.weAreSorry"),
          variant: "error",
        },
      ]
    : [];

  const handleSubmit = async (value: string) => {
    try {
      await getAuthenticationToken();
      const workflowTask = await fetchLatestWorkflowTask();

      navigation.navigate("Ivr.IvrWaitingScreen", {
        onApiCall: () =>
          handleOnCreatePasscode({
            correlationId,
            passcode: value,
            mobileNumber: mobileNumber!,
            nationalId: nationalId!,
            workflowTask: workflowTask!,
          }),
        handleOnCannotCreateErrorModal: () => {
          navigation.navigate("Onboarding.Iqama");
        },
        onUnSuccessfull: async () => {
          navigation.navigate(getActiveTask((await fetchLatestWorkflowTask())?.Name ?? ""));
        },
        onSuccess: async () => navigation.navigate(getActiveTask((await fetchLatestWorkflowTask())?.Name ?? "")),
        onBack: () => navigation.navigate("SignIn.Iqama"),
        varient: "modal",
      });
    } catch (err) {
      setAPIError(true);
      setCurrentValue("");

      warn("Error creating user passcode ", JSON.stringify(err));
    }
  };

  const resetError = () => {
    setCurrentValue("");
    setValidationError(false);
    setAPIError(false);
  };

  const handleOnChangeText = (input: string) => {
    setValidationError(false);
    setAPIError(false);

    setCurrentValue(input);

    if (input.length !== PASSCODE_LENGTH) return;
    if (input !== params.passcode) {
      setValidationError(true);
      setCurrentValue("");
      return;
    } else {
      setValidationError(false);
    }
    handleSubmit(input);
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["16p"],
    rowGap: theme.spacing["8p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} testID="Onboarding.ConfirmPasscodeScreen:NavHeader" />
      <>
        <ContentContainer>
          <View style={inputContainerStyle}>
            <PasscodeInput
              errorMessage={errorMessages}
              title={t("Onboarding.ConfirmPasscode.title")}
              subTitle={t("Onboarding.ConfirmPasscode.subTitle")}
              isError={hasValidationError || hasAPIError}
              showModel={hasAPIError}
              length={6}
              resetError={resetError}
              passcode={currentValue}
              testID="Onboarding.CreatePasscodeScreen:PasscodeInput"
            />
          </View>
        </ContentContainer>
        <NumberPad passcode={currentValue} setPasscode={handleOnChangeText} />
      </>
    </Page>
  );
}
