import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeStyles } from "@/theme";
import { isPasscodeIdentical, isSequential, maxRepeatThresholdMet } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { PASSCODE_LENGTH } from "../constants";
import { SignInStackParams } from "../SignInStack";

type CreatePassCodeScreenNavigationProp = NativeStackNavigationProp<SignInStackParams>;

const CreatePasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CreatePassCodeScreenNavigationProp>();
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const { isAuthenticated } = useAuthContext();

  const errorMessages = [
    {
      message: t("SignIn.CreatePasscodeScreen.notification"),
      icon: <ErrorFilledCircleIcon />,
    },
  ];

  const handleOnChangeText = (passcode: string) => {
    setPasscode(passcode);

    const convertedInput = westernArabicNumerals(passcode);

    if (!convertedInput) {
      return;
    }

    if (
      maxRepeatThresholdMet(convertedInput) ||
      (convertedInput.length === PASSCODE_LENGTH && isSequential(convertedInput))
    ) {
      setIsError(true);
      setPasscode("");
    } else {
      setIsError(false);
      if (convertedInput.length === PASSCODE_LENGTH) {
        navigation.navigate("SignIn.ConfirmPasscode", { passCode: passcode });
      }
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={isAuthenticated} />
      <View style={containerStyle}>
        <PasscodeInput
          errorMessage={errorMessages}
          title={t("SignIn.CreatePasscodeScreen.title")}
          subTitle={t("SignIn.CreatePasscodeScreen.subTitle")}
          isError={isError}
          length={6}
          passcode={passCode}
        />
        <View style={bannerStyle}>
          <Alert variant="default" message={t("SignIn.CreatePasscodeScreen.needHelpInfo")} />
        </View>
        <NumberPad passcode={passCode} setPasscode={handleOnChangeText} />
      </View>
    </Page>
  );
};
export default CreatePasscodeScreen;
