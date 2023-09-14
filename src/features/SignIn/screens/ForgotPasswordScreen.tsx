import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useThemeStyles } from "@/theme";

import { MobileAndNationalIdForm } from "../components";
import { SignInStackParamsNavigationProp } from "../SignInStack";
import { IqamaInputs } from "../types";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SignInStackParamsNavigationProp>();
  const otpFlow = useOtpFlow();

  const handleOnSubmit = async (values: IqamaInputs) => {
    otpFlow.handle({
      action: {
        to: "SignIn.ForgotPassword",
      },
      onOtpRequest: async () => {
        return {
          OtpId: "000000", // TODO: it will be replace by api data
          OtpCode: "1234", // TODO: it will be replace by api data
          PhoneNumber: values.MobileNumber,
          Status: true,
          oneTimePassword: {
            Length: 4,
            TimeToLive: 10,
            AllowedAttempts: 3,
          },
        };
      },
      onFinish: handleOtpVerification,
      otpVerifyMethod: "reset-passcode",
    });
  };

  const handleOtpVerification = async () => {
    navigation.navigate("SignIn.CardPin");
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader />
      <MobileAndNationalIdForm
        onSubmit={handleOnSubmit}
        errorMessages={[]}
        title={t("SignIn.ForgotPassword.title")}
        subTitle={t("SignIn.ForgotPassword.subTitle")}
        buttonText={t("SignIn.ForgotPassword.submitButtonText")}
      />
      <View style={buttonContainerStyle}>
        <Button variant="tertiary" onPress={() => navigation.goBack()}>
          {t("SignIn.ForgotPassword.backToLoginButtonText")}
        </Button>
      </View>
    </Page>
  );
}
