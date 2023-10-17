import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PASSCODE_LENGTH } from "../constants";
import { useCreatePasscode } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<OnboardingStackParams, "Onboarding.ConfirmPasscode">;

export function ConfirmPasscodeScreen() {
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const createPasscode = useCreatePasscode();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [hasValidationError, setValidationError] = useState<boolean>(false);
  const [hasAPIError, setAPIError] = useState<boolean>(false);
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const [currentValue, setCurrentValue] = useState("");

  const handleOnSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.navigate("Onboarding.SuccessScreen", { passcode: currentValue });
  };

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
      await createPasscode.mutateAsync(value);
      setShowSuccessModal(true);
    } catch (err) {
      setAPIError(true);
      setCurrentValue("");

      warn("Error creating user passcode ", JSON.stringify(err)); // log the error for debugging purposes
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
      {createPasscode.isLoading ? (
        <FullScreenLoader />
      ) : (
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
          <NotificationModal
            buttons={{
              primary: (
                <Button onPress={handleOnSuccessModalClose}>{t("Onboarding.ConfirmPasscode.proceedToHomepage")}</Button>
              ),
            }}
            title={t("Onboarding.ConfirmPasscode.notificationModelTitle")}
            isVisible={showSuccessModal}
            message={t("Onboarding.ConfirmPasscode.notificationModelMessage")}
            variant="success"
          />
        </>
      )}
    </Page>
  );
}

export default ConfirmPasscodeScreen;
