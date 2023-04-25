import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Keyboard, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import maskPhoneNumber from "@/utils/mask-phone-number";

import { useOtpValidation } from "../hooks/query-hooks";
import { OtpChallengeParams } from "../types";

export default function OneTimePasswordModal<ParamsT extends object, OutputT extends object>() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<MainStackParams, "OneTimePassword.OneTimePasswordModal">>();
  const otpValidationAsync = useOtpValidation<ParamsT, OutputT>(params.otpVerifyMethod);

  const [otpParams, setOtpParams] = useState<OtpChallengeParams | undefined>(params.otpChallengeParams);
  const [isGenericErrorVisible, setIsGenericErrorVisible] = useState(false);
  const [isOtpCodeInvalidErrorVisible, setIsOtpCodeInvalidErrorVisible] = useState(false);
  const [otpResetCountSeconds, setOtpResetCountSeconds] = useState(OTP_RESET_COUNT_SECONDS);
  const [otpResendsRequested, setOtpResendsRequested] = useState(0);
  const [currentValue, setCurrentValue] = useState("");

  const isOtpExpired = otpResetCountSeconds <= 0;
  const isReachedMaxAttempts = otpResendsRequested === OTP_MAX_RESENDS && isOtpExpired;

  useEffect(() => {
    if (otpResetCountSeconds <= 0) return;

    const timeoutId = setTimeout(() => {
      if (otpResetCountSeconds > 0) {
        setOtpResetCountSeconds(current => current - 1);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [otpResetCountSeconds]);

  useEffect(() => {
    if (otpParams === undefined) return;
    Alert.alert(`OTP-code is: ${otpParams.OtpCode}`);
  }, [otpParams]);

  useEffect(() => {
    async function main() {
      if (undefined !== otpParams) {
        return;
      }

      try {
        const response = await params.onOtpRequest();
        setOtpParams(response);
      } catch (error) {
        warn("one-time-password", "Could not request OTP parameters: ", JSON.stringify(error));
        setIsGenericErrorVisible(true);
      }
    }

    main();
  }, [params, otpParams]);

  useEffect(() => {
    if (isGenericErrorVisible || isReachedMaxAttempts) Keyboard.dismiss();
  }, [isGenericErrorVisible, isReachedMaxAttempts]);

  const handleOnCancel = () => {
    // @ts-expect-error unable to properly add types for this call
    navigation.navigate(params.action.to, {
      ...params.action.params,
      otpResponseStatus: "cancel",
    });
  };

  const handleOnRequestResendPress = async () => {
    if (otpResendsRequested >= OTP_MAX_RESENDS) {
      return;
    }

    try {
      const response = await params.onOtpRequest();

      setOtpParams(response);
      setIsGenericErrorVisible(false);
      setIsOtpCodeInvalidErrorVisible(false);
      setOtpResetCountSeconds(OTP_RESET_COUNT_SECONDS);
      setCurrentValue("");
    } catch (error) {
      warn("one-time-password", "Could not re-request OTP-code: ", JSON.stringify(error));
      setIsGenericErrorVisible(true);
    } finally {
      setOtpResendsRequested(current => current + 1);
    }
  };

  const handleOnRequestResendErrorClose = () => {
    setIsGenericErrorVisible(false);

    setTimeout(() => {
      // @ts-expect-error cannot type navigate call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    }, 500);
  };

  const handleOnChangeText = (value: string) => {
    if (isReachedMaxAttempts) return;

    setCurrentValue(value);
    setIsOtpCodeInvalidErrorVisible(false);

    if (value.length === OTP_CODE_LENGTH) {
      handleOnSubmit(value);
    }
  };

  const handleOnSubmit = async (otpCode: string) => {
    if (otpParams === undefined) {
      return;
    }

    try {
      const { IsOtpValid, NumOfAttempts, ...restProps } = await otpValidationAsync.mutateAsync({
        OtpId: otpParams.OtpId,
        OtpCode: otpCode,
        optionalParams: params.otpOptionalParams as ParamsT,
      });

      if (!IsOtpValid) {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");

        return;
      }

      // @ts-expect-error unable to properly add types for this call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "success",
        otpResponsePayload: restProps,
      });
    } catch (error) {
      // @ts-expect-error cannot property type navigate
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });

      warn("one-time-password", "Could not validate OTP-code with backend: ", JSON.stringify(error));
    }
  };

  const otpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["16p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnCancel} />} />
        {undefined !== otpParams ? (
          <ContentContainer>
            <Stack direction="vertical" gap="16p">
              <Typography.Text size="title1" weight="semiBold">
                {t("OneTimePasswordModal.title")}
              </Typography.Text>
              <Typography.Text size="callout">
                {t("OneTimePasswordModal.message", { phoneNumber: maskPhoneNumber(otpParams.PhoneNumber, 4) })}
              </Typography.Text>
              <View style={otpContainerStyle}>
                <PincodeInput
                  autoComplete="one-time-code"
                  autoFocus
                  isEditable={!isReachedMaxAttempts}
                  isError={isReachedMaxAttempts}
                  onChangeText={handleOnChangeText}
                  length={OTP_CODE_LENGTH}
                  value={currentValue}
                />
                {isOtpCodeInvalidErrorVisible ? (
                  <InlineBanner
                    variant="error"
                    icon={<ErrorFilledCircleIcon />}
                    text={t("OneTimePasswordModal.errors.invalidPassword")}
                  />
                ) : null}
                {isOtpExpired ? (
                  <>
                    {otpResendsRequested === 0 ? (
                      <InlineBanner
                        variant="error"
                        icon={<ErrorFilledCircleIcon />}
                        text={t("OneTimePasswordModal.errors.twoAttemptsLeft")}
                      />
                    ) : otpResendsRequested === 1 ? (
                      <InlineBanner
                        variant="error"
                        icon={<ErrorFilledCircleIcon />}
                        text={t("OneTimePasswordModal.errors.oneAttemptLeft")}
                      />
                    ) : null}
                  </>
                ) : null}
                {otpResendsRequested < OTP_MAX_RESENDS ? (
                  <Typography.Text
                    size="callout"
                    color={isOtpExpired ? "primaryBase" : "neutralBase"}
                    onPress={() => handleOnRequestResendPress()}
                    disabled={!isOtpExpired}>
                    {isOtpExpired
                      ? t("OneTimePasswordModal.resendCodeEnabled")
                      : t("OneTimePasswordModal.resendCodeDisabled", {
                          minutes: Math.floor(otpResetCountSeconds / 60),
                          seconds: String(otpResetCountSeconds % 60).padStart(2, "0"),
                        })}
                  </Typography.Text>
                ) : null}
              </View>
            </Stack>
          </ContentContainer>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorVisible}
        onClose={handleOnRequestResendErrorClose}
      />
      <NotificationModal
        variant="error"
        title={t("OneTimePasswordModal.errors.reachedMaxAttemptsTitle")}
        message={t("OneTimePasswordModal.errors.reachedMaxAttemptsMessage")}
        isVisible={isReachedMaxAttempts}
        buttons={{
          primary: <Button onPress={handleOnRequestResendErrorClose}>{t("OneTimePasswordModal.errors.button")}</Button>,
        }}
      />
    </SafeAreaProvider>
  );
}

const OTP_CODE_LENGTH = 4;
const OTP_MAX_RESENDS = 2;
const OTP_RESET_COUNT_SECONDS = 120;
