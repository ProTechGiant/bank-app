import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import Passcode from "@/components/PasscodeInput";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { MAX_FAILED_ATTEMPTS, PASSCODE } from "../constants";

const ChangePasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [passCode, setPasscode] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (passCode.length !== 6) return;

    if (passCode === PASSCODE) {
      setIsError(false);
      navigation.navigate("SignIn.CreatePasscode");
    } else {
      setFailedAttempts((prevVal: number) => {
        return prevVal + 1;
      });
      setIsError(true);
    }
    setPasscode("");
  }, [passCode]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      checkBlockedUser();
    });
  }, [navigation]);

  const resetError = () => {
    setFailedAttempts(0);
    blockUser(1);
    navigation.navigate("SignIn.UserBlocked");
  };

  const checkBlockedUser = async () => {
    const blocked = await isBlocked();
    if (blocked) {
      navigation.navigate("SignIn.UserBlocked");
    }
  };

  const isBlocked = async () => {
    const blockEndTime: string | null = await EncryptedStorage.getItem("blockEndTime");
    if (blockEndTime && new Date().getTime() < +JSON.parse(blockEndTime)) {
      return true;
    } else {
      return false;
    }
  };

  const blockUser = async (blockTime: number) => {
    const blockEndTime = new Date().getTime() + blockTime * 60 * 1000;
    await EncryptedStorage.setItem("blockEndTime", JSON.stringify(blockEndTime));
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={container}>
        <Passcode
          failedAttemptsLimit={MAX_FAILED_ATTEMPTS}
          user={null}
          errorTitle={t("SignIn.ChangePasscodeScreen.errorTitle")}
          title={t("SignIn.ChangePasscodeScreen.title")}
          subTitle={t("SignIn.ChangePasscodeScreen.subTitle")}
          isError={isError}
          errorMessage=""
          notification={t("SignIn.ChangePasscodeScreen.notification")}
          length={6}
          passcode={passCode}
          failedAttempts={failedAttempts}
          resetError={resetError}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
};
export default ChangePasscodeScreen;
