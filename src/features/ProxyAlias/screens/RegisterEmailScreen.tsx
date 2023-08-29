import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useRegisterEmail, useSendProxiesOTP } from "../hooks/query-hooks";

export interface Email {
  Email: string;
}

export default function RegisterEmailScreen() {
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const useSendProxiesOtpAsync = useSendProxiesOTP();
  const { t } = useTranslation();
  const registerEmail = useRegisterEmail();
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const registerInfoLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    marginBottom: theme.spacing["20p"],
  }));

  const reasonValidationSchema = Yup.object().shape({
    Email: Yup.string().required().email(t("ProxyAlias.RegisterEmailScreen.validationErrors.email.email")),
  });

  const { control, handleSubmit } = useForm<Email>({
    resolver: yupResolver(reasonValidationSchema),
    mode: "onBlur",
  });

  const handleOnSendOTP = async (values: Email) => {
    try {
      otpFlow.handle({
        action: {
          to: "ProxyAlias.RegisterEmailScreen",
          params: {},
        },
        otpChallengeParams: {
          Email: values.Email,
        },
        otpVerifyMethod: "register-email",
        onOtpRequest: () => {
          return useSendProxiesOtpAsync.mutateAsync("register-email");
        },
        onFinish: (status: string) => {
          if (status === "success") {
            handleOnSubmit(values);
          }
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleOnSubmit = async (values: Email) => {
    try {
      const response = await registerEmail.mutateAsync({ Email: values.Email });
      if (response.Status === "204") {
        setShowSuccess(true);
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnClose = () => {
    setShowSuccess(false);
    handleOnBackPress();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader onBackPress={handleOnBackPress} />
      <ContentContainer>
        <Typography.Text size="title1" weight="semiBold">
          {t("ProxyAlias.RegisterEmailScreen.title")}
        </Typography.Text>
        {registerEmail.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Typography.Text size="callout" style={registerInfoLabelStyle}>
              {t("ProxyAlias.RegisterEmailScreen.subTitle")}
            </Typography.Text>
            <TextInput
              control={control}
              name="Email"
              label={t("ProxyAlias.RegisterEmailScreen.emailPlaceholder")}
              showCharacterCount
            />
            <Stack direction="vertical" align="stretch" gap="4p" style={styles.buttonContainer}>
              <Button onPress={handleSubmit(handleOnSendOTP)}>
                {t("ProxyAlias.RegisterEmailScreen.buttonContinue")}
              </Button>
              <Button onPress={handleOnBackPress} variant="tertiary">
                {t("ProxyAlias.RegisterEmailScreen.buttonCancel")}
              </Button>
              <NotificationModal
                variant="error"
                onClose={() => {
                  setShowError(false);
                }}
                title={t("ProxyAlias.RegisterEmailScreen.errorEmailRegistrationFailedTitle")}
                message={t("ProxyAlias.RegisterEmailScreen.errorEmailRegistrationFailedMessage")}
                isVisible={showError}
              />
              <NotificationModal
                variant="success"
                title={t("ProxyAlias.RegisterEmailScreen.emailRegistrationSuccessTitle")}
                message={t("ProxyAlias.RegisterEmailScreen.emailRegistrationSuccessMessage")}
                isVisible={showSuccess}
                buttons={{
                  primary: <Button onPress={handleOnClose}>{t("ProxyAlias.SuccessModal.continue")}</Button>,
                }}
              />
            </Stack>
          </>
        )}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
