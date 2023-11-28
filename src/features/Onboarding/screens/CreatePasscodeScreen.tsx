import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { isPasscodeValid } from "@/utils/is-valid-passcode";
import { maxRepeatThresholdMet } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { PASSCODE_LENGTH } from "../constants";

export default function CreatePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  const errorMessages = [
    {
      message: t("Onboarding.CreatePasscode.notification"),
      icon: <ErrorFilledCircleIcon />,
    },
  ];

  const handleOnChangeText = (input: string) => {
    setCurrentValue(input);
    if (!input) return;

    const convertedInput = westernArabicNumerals(input);

    if (
      maxRepeatThresholdMet(convertedInput) ||
      (input.length === PASSCODE_LENGTH && !isPasscodeValid(convertedInput))
    ) {
      setIsErrorVisible(true);
      setCurrentValue("");
    } else {
      setIsErrorVisible(false);
      if (input.length === PASSCODE_LENGTH) {
        navigation.navigate("Onboarding.ConfirmPasscode", { passcode: input });
      }
    }
  };

  const alertStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} testID="Onboarding.CreatePasscodeScreen:NavHeader" />
      <View style={styles.containerStyle}>
        <PasscodeInput
          errorMessage={errorMessages}
          title={t("Onboarding.CreatePasscode.title")}
          subTitle={t("Onboarding.CreatePasscode.subTitle")}
          isError={isErrorVisible}
          length={6}
          passcode={currentValue}
          testID="Onboarding.CreatePasscodeScreen:PasscodeInput"
        />
        <View style={alertStyle}>
          <Alert variant="default" message={t("SignIn.CreatePasscodeScreen.needHelpInfo")} />
        </View>
        <NumberPad passcode={currentValue} setPasscode={handleOnChangeText} bottom={20} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
});
