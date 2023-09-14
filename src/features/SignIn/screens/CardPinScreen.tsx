import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Alert from "@/components/Alert";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME, PINCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useValidatePincode } from "../hooks/query-hooks";

export default function CardPinScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height: screenHeight } = useWindowDimensions();
  const { mutateAsync: validatePincode, data } = useValidatePincode();
  const { errorMessages } = useErrorMessages(data as ApiError);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");

  useEffect(() => {
    handleOnChange();
  }, [pinCode]);

  const handleOnChange = () => {
    if (pinCode.length === PINCODE_LENGTH) {
      handleSubmit();
      setPinCode("");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await validatePincode(pinCode);
      if (response.Status) {
        handleNavigate();
      }
      const errorId = response?.errorContent?.Errors[0]?.ErrorId;
      if (errorId === "0032") handleBlocked(BLOCKED_TIME); //TODO: This logic will be removed once aPI will be working
    } catch (error: any) {
      setPinCode("");
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

  const handleNavigate = async () => {
    try {
      navigation.navigate("SignIn.CreatePasscode");
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleNavigateToBlockScreen = () => {
    setShowModel(false);
    navigation.navigate("SignIn.UserBlocked", {
      type: "passcode",
    });
  };

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
    height: screenHeight * 0.23,
  }));

  const forgotPinTextStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["64p"],
    width: "100%",
    textAlign: "center",
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          title={t("SignIn.CardPinScreen.title")}
          errorMessage={errorMessages}
          isError={true} //TODO: This will be handled by the isError state managing the API call
          showModel={showModel}
          subTitle={t("SignIn.CardPinScreen.subTitle")}
          resetError={handleNavigateToBlockScreen}
          length={4}
          passcode={pinCode}
        />
        <View style={bannerStyle}>
          <Alert variant="default" message={t("SignIn.CardPinScreen.needHelpInfo")} />
        </View>
        <NumberPad passcode={pinCode} setPasscode={setPinCode} />
        <Pressable
          style={forgotPinTextStyle}
          onPress={() => navigation.navigate("Onboarding.OnboardingStack", { screen: "Onboarding.Nafath" })}>
          <Typography.Text
            color="primaryBase-30"
            align="center"
            weight="medium"
            size="footnote"
            style={styles.underline}>
            {t("SignIn.CardPinScreen.forgotCardPin")}
          </Typography.Text>
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
