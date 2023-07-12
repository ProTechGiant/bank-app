import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { isSequential, maxRepeatThresholdMet } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { PASSCODE_LENGTH } from "../constants";
import { useOnboardingBackButton } from "../hooks";

export default function CreatePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const handleOnBackPress = useOnboardingBackButton();

  const [currentValue, setCurrentValue] = useState("");

  const handleOnChangeText = (input: string) => {
    setCurrentValue(input);
    if (!input) {
      return;
    }
    const convertedInput = westernArabicNumerals(input);

    if (maxRepeatThresholdMet(convertedInput) || (input.length === PASSCODE_LENGTH && isSequential(convertedInput))) {
      setIsErrorVisible(true);
      setCurrentValue("");
    } else {
      setIsErrorVisible(false);
      if (input.length === PASSCODE_LENGTH) {
        navigation.navigate("Onboarding.ConfirmPasscode", { passcode: input });
      }
    }
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["32p"],
    rowGap: theme.spacing["8p"],
    width: "100%",
  }));

  return (
    <Page insets={["top"]} backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} onBackPress={handleOnBackPress}>
        <ProgressIndicator currentStep={5} totalStep={6} />
      </NavHeader>
      <ContentContainer>
        <Typography.Text size="title1" weight="medium">
          {t("Onboarding.CreatePasscode.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular">
          {t("Onboarding.CreatePasscode.subTitle")}
        </Typography.Text>
        <View style={inputContainerStyle}>
          <PincodeInput autoFocus onChangeText={handleOnChangeText} length={PASSCODE_LENGTH} value={currentValue} />
          {isErrorVisible ? <Alert variant="error" message={t("Onboarding.CreatePasscode.needHelpInfo")} /> : null}
        </View>
      </ContentContainer>
    </Page>
  );
}
