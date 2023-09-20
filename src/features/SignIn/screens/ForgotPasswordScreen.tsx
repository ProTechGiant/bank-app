import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import { useThemeStyles } from "@/theme";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { MobileAndNationalIdForm } from "../components";
import { useErrorMessages } from "../hooks";
import { useSendLoginOTP } from "../hooks/query-hooks";
import { SignInStackParamsNavigationProp } from "../SignInStack";
import { IqamaInputs } from "../types";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SignInStackParamsNavigationProp>();
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const { mutateAsync, error, reset } = useSearchUserByNationalId();
  const userInfoError = error as ApiError;
  const { errorMessages } = useErrorMessages(userInfoError);
  const blockedUserFlow = useBlockedUserFlow();
  const [notMatchRecord, setNotMatchRecord] = useState(false);

  useEffect(() => {
    if (userInfoError?.errorContent?.Errors?.some(({ ErrorId }: { ErrorId: string }) => ErrorId === "0061")) {
      reset();
    }
  }, [userInfoError, reset]);

  const handleOTP = () => {
    otpFlow.handle({
      action: {
        to: "SignIn.ForgotPassword",
      },
      onOtpRequest: async () => {
        return useSendLoginOtpAsync.mutateAsync("reset-passcode");
      },
      otpVerifyMethod: "reset-passcode",
      onFinish: (status: string) => {
        if (status === "success") {
          navigation.navigate("SignIn.CardPin");
        }
      },
      onUserBlocked: () => {
        blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
      },
    });
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      const { NationalId, MobileNumber } = values;
      const response = await mutateAsync({ NationalId, MobileNumber });
      if (response.TotalRecords === 1) {
        setNotMatchRecord(false);
        storeUserToLocalStorage(response);
        handleOTP(values);
      } else if (response.TotalRecords === 0) {
        setNotMatchRecord(true);
      }
    } catch (err) {
      setNotMatchRecord(false);
      warn("ForgotPassword", "user not found. Error: ", JSON.stringify(err));
    }
  };

  const storeUserToLocalStorage = (user: UserType) => {
    setItemInEncryptedStorage("user", JSON.stringify(user));
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader />
      <MobileAndNationalIdForm
        onSubmit={handleOnSubmit}
        errorMessages={errorMessages}
        notMatchRecord={notMatchRecord}
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
