import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import BiometricsService from "@/services/BiometricService";
import { useThemeStyles } from "@/theme";

import { BLOCKED_TIME, CORRELATION_ID, OTP_CODE, OTP_ID, PASSCODE, PHONE_NUMBER } from "../constants";

const PasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [passCode, setPasscode] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setBiometricsKeyExist((await BiometricsService.biometricKeysExist()).keysExist);
      setIsSensorAvailable((await BiometricsService.isSensorAvailable()).available);
    })();

    if (passCode.length !== 6) {
      return;
    }
    if (passCode === PASSCODE) {
      setIsError(false);
      setFailedAttempts(0);
      navigation.navigate("OneTimePassword.OneTimePasswordModal", {
        action: {
          to: "SignIn.Biometric",
          params: {
            // your params here
          },
        },
        otpChallengeParams: {
          OtpId: OTP_ID,
          OtpCode: OTP_CODE,
          PhoneNumber: PHONE_NUMBER,
          correlationId: CORRELATION_ID,
        },
        onOtpRequestResend: async () => {
          return {
            OtpId: OTP_ID,
            OtpCode: OTP_CODE,
            PhoneNumber: PHONE_NUMBER,
            correlationId: CORRELATION_ID,
            otpFormType: "card-actions",
          };
        },
        onOtpRequest: async () => {
          return {
            OtpId: OTP_ID,
            OtpCode: OTP_CODE,
            PhoneNumber: PHONE_NUMBER,
            correlationId: CORRELATION_ID,
            otpFormType: "card-actions",
          };
        },
        otpVerifyMethod: "card-actions",
      });
    } else {
      setPasscode("");
      setFailedAttempts((prevVal: number) => {
        return prevVal + 1;
      });
      setIsError(true);
    }
  }, [passCode]);

  useEffect(() => {
    (async () => {
      const userData = await EncryptedStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    })();
    navigation.addListener("focus", () => {
      checkBlockedUser();
    });
  }, [navigation]);

  const resetError = () => {
    setIsError(false);
    setFailedAttempts(0);
    blockUser(BLOCKED_TIME);
    navigation.navigate("SignIn.UserBlocked");
  };

  const checkBlockedUser = async () => {
    const blocked = await isBlocked(); // Check if the user is blocked
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

  const handleBioMatric = async () => {
    navigation.navigate("SignIn.Biometric");
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  const forgotPasscodeTextStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["64p"],
    width: theme.spacing.full,
    textAlign: "center",
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={container}>
        <PasscodeInput
          failedAttemptsLimit={3}
          user={user}
          title={
            !user
              ? t("SignIn.PasscodeScreen.title")
              : t("SignIn.PasscodeScreen.userTitle", { username: user.name.split(" ")[0] })
          }
          errorTitle={t("SignIn.PasscodeScreen.errorTitle")}
          isError={isError}
          subTitle={user ? t("SignIn.PasscodeScreen.subTitle") : ""}
          notification={t("SignIn.PasscodeScreen.notifocation", { attempts: 3 - failedAttempts })}
          errorMessage={t("SignIn.PasscodeScreen.errorMessage", { time: BLOCKED_TIME })}
          length={6}
          passcode={passCode}
          failedAttempts={failedAttempts}
          resetError={resetError}
        />
        <NumberPad
          handleBioMatric={handleBioMatric}
          isBiomatric={biometricsKeyExist && isSensorAvailable}
          passcode={passCode}
          setPasscode={setPasscode}
        />
        <Pressable style={forgotPasscodeTextStyle} onPress={() => navigation.navigate("SignIn.ForgotPassword")}>
          <Typography.Text color="primaryBase" align="center" weight="semiBold" size="callout">
            {t("SignIn.PasscodeScreen.forgotPassword")}
          </Typography.Text>
        </Pressable>
      </View>
    </Page>
  );
};
export default PasscodeScreen;
