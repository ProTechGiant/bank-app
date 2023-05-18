import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useThemeStyles } from "@/theme";

import { SignInStackParams } from "../SignInStack";

type CreatePassCodeScreenNavigationProp = NativeStackNavigationProp<SignInStackParams>;

const CreatePasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CreatePassCodeScreenNavigationProp>();
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (passCode.length !== 6) {
      return;
    }

    if (!passcodeValidate(passCode)) {
      setIsError(false);
      navigation.navigate("SignIn.ConfirmPasscode", { passCode });
    } else {
      setIsError(true);
    }
    setPasscode("");
  }, [navigation, passCode]);

  const container = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={container}>
        <PasscodeInput
          failedAttemptsLimit={3}
          title={t("SignIn.CreatePasscodeScreen.title")}
          subTitle={t("SignIn.CreatePasscodeScreen.subTitle")}
          notification={t("SignIn.CreatePasscodeScreen.notifocation")}
          isError={isError}
          length={6}
          passcode={passCode}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
};
export default CreatePasscodeScreen;

function passcodeValidate(str: string) {
  const charArray = str.split("");
  const repeatedChars = charArray.filter(function (char, index) {
    return charArray.indexOf(char) !== index;
  });
  return repeatedChars.length > 0;
}
