import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useLoginUser, useSendLoginOTP } from "../hooks/query-hooks";
import { UserType } from "../types";

export default function ChangePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  //TODO : will use it once API is ready
  // const { mutateAsync, error: loginError , isError } = useLoginUser();
  // const loginUserError = loginError as ApiError;
  // const { errorMessages } = useErrorMessages(loginUserError);
  const { mutateAsync, data } = useLoginUser();
  const { errorMessages } = useErrorMessages(data as ApiError);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

  useEffect(() => {
    (async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    })();
  }, []);

  const handleUserLogin = async () => {
    try {
      const response = await mutateAsync({ passCode, nationalId: user?.NationalId });
      if (response.AccessToken) {
        handleNavigate();
      }
      //TODO: This logic will be removed once API is ready
      const errorId = response?.errorContent?.Errors[0].ErrorId;
      if (errorId === "0009") handleBlocked(BLOCKED_TIME);
      if (errorId === "0010") handleBlocked();
      setPasscode("");
    } catch (error: any) {
      // const errorId = error?.errorContent?.Errors[0].ErrorId;
      // if (errorId === "0009") handleBlocked(BLOCKED_TIME);
      // if (errorId === "0010") handleBlocked();
      setPasscode("");
    }
  };

  const handleBlocked = async (blockTime?: number) => {
    setShowModel(true);
    if (!blockTime) {
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(true));
    } else {
      const userBlockTime = new Date().getTime() + blockTime * 60 * 1000;
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(userBlockTime));
    }
  };

  const handleOnChange = () => {
    if (passCode.length === PASSCODE_LENGTH) {
      handleUserLogin();
      setPasscode("");
    }
  };

  const handleNavigate = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.ChangePasscode",
          params: {},
        },
        otpVerifyMethod: "change-passcode",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("change-passcode");
        },
        onFinish: (status: string) => {
          if (status === "success") {
            delayTransition(() => handleOtpVerification());
          }
        },
        onUserBlocked: () => {
          handleBlocked(BLOCKED_TIME);
          navigation.navigate("SignIn.UserBlocked", {
            type: "otp",
            navigateTo: "SignIn.ChangePasscode",
          });
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleNavigateToBlockScreen = () => {
    setShowModel(false);
    navigation.navigate("SignIn.UserBlocked", {
      type: "passcode",
      navigateTo: "Settings.CustomerAccountManagementScreen",
    });
  };

  const handleOtpVerification = async () => {
    navigation.navigate("SignIn.CreatePasscode");
  };

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          title={t("SignIn.ChangePasscodeScreen.title")}
          subTitle={t("SignIn.ChangePasscodeScreen.subTitle")}
          errorMessage={errorMessages}
          showModel={showModel}
          resetError={handleNavigateToBlockScreen}
          passcode={passCode}
          isError={true} //TODO: This will be handled by the isError state managing the API call
          length={PASSCODE_LENGTH}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
});
