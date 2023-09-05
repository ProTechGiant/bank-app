import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PASSCODE_LENGTH } from "../constants";
import { useCreatePasscode } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<OnboardingStackParams, "Onboarding.ConfirmPasscode">;

export function ConfirmPasscodeScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const { mutateAsync } = useCreatePasscode();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [hasValidationError, setValidationError] = useState<boolean>(false);
  const [hasAPIError, setAPIError] = useState<boolean>(false);

  const [currentValue, setCurrentValue] = useState("");

  const handleOnSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.navigate("Onboarding.PendingAccount");
  };

  const handleSubmit = async (value: string) => {
    try {
      await mutateAsync(value);
      setShowSuccessModal(true);
    } catch (err) {
      setAPIError(true);
      setCurrentValue("");

      warn("Error creating user passcode ", JSON.stringify(err)); // log the error for debugging purposes
    }
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
      <NavHeader
        withBackButton={true}
        title={t("Onboarding.ConfirmPasscode.navHeaderTitle")}
        testID="Onboarding.ConfirmPasscodeScreen:NavHeader">
        <ProgressIndicator currentStep={5} totalStep={6} />
      </NavHeader>
      <ContentContainer>
        <Typography.Text size="title1" weight="medium">
          {t("Onboarding.ConfirmPasscode.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular">
          {t("Onboarding.ConfirmPasscode.subTitle")}
        </Typography.Text>
        <View style={inputContainerStyle}>
          <PincodeInput
            autoFocus
            onChangeText={handleOnChangeText}
            length={PASSCODE_LENGTH}
            value={currentValue}
            testID="Onboarding.ConfirmPasscodeScreen:PincodeInput"
          />
          {hasValidationError ? (
            <Alert variant="error" message={t("Onboarding.ConfirmPasscode.notification")} />
          ) : hasAPIError ? (
            <Alert variant="error" message={t("Onboarding.ConfirmPasscode.errorText")} />
          ) : null}
        </View>
      </ContentContainer>
      <NotificationModal
        title={t("Onboarding.ConfirmPasscode.notificationModelTitle")}
        isVisible={showSuccessModal}
        message={t("Onboarding.ConfirmPasscode.notificationModelMessage")}
        onClose={handleOnSuccessModalClose}
        variant="success"
      />
    </Page>
  );
}

export default ConfirmPasscodeScreen;
