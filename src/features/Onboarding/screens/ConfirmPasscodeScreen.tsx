import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PASSCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useCreatePasscode } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<OnboardingStackParams, "Onboarding.ConfirmPasscode">;

export function ConfirmPasscodeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const { mutateAsync, error } = useCreatePasscode();
  const createPasscodeError = error as ApiError;
  const { errorMessages } = useErrorMessages(createPasscodeError);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
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
      warn("Error updating user passcode ", JSON.stringify(err)); // log the error for debugging purposes
    }
  };

  const handleOnChangeText = (input: string) => {
    setIsErrorVisible(false);
    setCurrentValue(input);

    if (input.length !== PASSCODE_LENGTH) return;
    if (input !== params.passcode) {
      setIsErrorVisible(true);
      return;
    } else {
      setIsErrorVisible(false);
    }
    handleSubmit(input);
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["16p"],
    rowGap: theme.spacing["10p"],
    width: "100%",
  }));

  const marginHorizontal = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["18p"],
  }));

  return (
    <Page insets={["top"]} backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} title={t("Onboarding.ConfirmPasscode.navHeaderTitle")}>
        <ProgressIndicator currentStep={5} totalStep={6} />
      </NavHeader>
      <ContentContainer style={marginHorizontal}>
        <Typography.Text size="title1" weight="medium">
          {t("Onboarding.ConfirmPasscode.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular">
          {t("Onboarding.ConfirmPasscode.subTitle")}
        </Typography.Text>
        <View style={inputContainerStyle}>
          <PincodeInput autoFocus onChangeText={handleOnChangeText} length={PASSCODE_LENGTH} value={currentValue} />
          {isErrorVisible || !!errorMessages.length ? (
            <InlineBanner
              icon={<ErrorFilledCircleIcon />}
              variant="error"
              text={t("Onboarding.ConfirmPasscode.notification")}
            />
          ) : null}
        </View>
      </ContentContainer>
      <NotificationModal
        message={t("Onboarding.ConfirmPasscode.notificationModelMessage")}
        isVisible={showSuccessModal}
        title=""
        onClose={handleOnSuccessModalClose}
        variant="success"
      />
    </Page>
  );
}
export default ConfirmPasscodeScreen;
