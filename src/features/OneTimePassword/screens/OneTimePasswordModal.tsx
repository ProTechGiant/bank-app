import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, View, ViewStyle } from "react-native";
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
import { OtpChallengeParams, OtpFormType } from "../types";

export default function OneTimePasswordModal<ParamsT extends object, OutputT extends object>() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<MainStackParams, "OneTimePassword.OneTimePasswordModal">>();

  const otpValidationAsync = useOtpValidation<ParamsT, OutputT>();
  const [otpParams, setOtpParams] = useState<(typeof params)["otpChallengeParams"]>(params.otpChallengeParams);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isOtpCodeInvalidErrorVisible, setIsOtpCodeInvalidErrorVisible] = useState(false);
  const [otpResetCountMinutes, setOtpResetCountMinutes] = useState(OTP_RESET_TIMEOUT_M);
  const [otpResetCountSeconds, setOtpResetCountSeconds] = useState(OTP_RESET_TIMEOUT_S);
  const [otpResendsRequested, setOtpResendsRequested] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  const isReachedTwoAttemptsLeft = otpResendsRequested === OTP_MAX_RESENDS - 3 && isOtpExpired;
  const isReachedOneAttemptLeft = otpResendsRequested === OTP_MAX_RESENDS - 2 && isOtpExpired;
  const isReachedMaxAttempts = otpResendsRequested === OTP_MAX_RESENDS - 1 && isOtpExpired;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (otpResetCountSeconds === 0) {
        if (otpResetCountMinutes === 0) {
          setIsOtpExpired(true);
        }
      }
      if (otpResetCountSeconds > 0) {
        setOtpResetCountSeconds(s => Math.min(s - 1, OTP_RESET_TIMEOUT_S));
      } else if (otpResetCountMinutes > 0) {
        setOtpResetCountMinutes(m => Math.min(m - 1, OTP_RESET_TIMEOUT_M));
        setOtpResetCountSeconds(OTP_RESET_TIMEOUT_S);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [otpResetCountMinutes, otpResetCountSeconds]);

  useEffect(() => {
    Alert.alert(`OTP-code is: ${otpParams.OtpCode}`);
  }, [otpParams]);

  useEffect(() => {
    if (isReachedTwoAttemptsLeft || isReachedOneAttemptLeft) setIsOtpCodeInvalidErrorVisible(false);
  }, [isReachedOneAttemptLeft, isReachedTwoAttemptsLeft]);

  useEffect(() => {
    if (isErrorVisible || isReachedMaxAttempts) Keyboard.dismiss();
  }, [isErrorVisible, isReachedMaxAttempts]);

  const handleOnCancel = () => {
    // @ts-expect-error unable to properly add types for this call
    navigation.navigate(params.action.to, {
      ...params.action.params,
      otpResponseStatus: "cancel",
    });
  };

  const handleOnRequestResendPress = async (otpFormType: OtpFormType) => {
    if (otpResendsRequested >= OTP_MAX_RESENDS) return;

    try {
      const response = await params.onOtpRequestResend();
      const updatedParams: OtpChallengeParams = {
        ...response,
        otpFormType,
      };
      setOtpParams(updatedParams);
      setIsErrorVisible(false);
      setIsOtpCodeInvalidErrorVisible(false);
      setIsOtpExpired(false);
      setOtpResetCountMinutes(OTP_RESET_TIMEOUT_M);
      setOtpResetCountSeconds(OTP_RESET_TIMEOUT_S);
      setCurrentValue("");
    } catch (error) {
      warn("card-actions", "Could not re-request OTP-code: ", JSON.stringify(error));
      setIsErrorVisible(true);
    } finally {
      setOtpResendsRequested(current => current + 1);
    }
  };

  const handleOnRequestResendErrorClose = () => {
    setIsErrorVisible(false);
    setTimeout(() => {
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
    try {
      const { IsOtpValid, NumOfAttempts, ...restProps } = await otpValidationAsync.mutateAsync({
        otpFormType: otpParams.otpFormType,
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
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
      warn("card-actions", "Could not validate OTP-code with backend: ", JSON.stringify(error));
    }
  };

  const otpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["16p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  const phoneNumber = (otpParams.PhoneNumber !== undefined && maskPhoneNumber(otpParams.PhoneNumber, 4)) || "";

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnCancel} />} />
        <ContentContainer>
          <Stack direction="vertical" gap="16p">
            <Typography.Text size="title1" weight="semiBold">
              {t("OneTimePasswordModal.title")}
            </Typography.Text>
            <Typography.Text size="callout">{t("OneTimePasswordModal.message", { phoneNumber })}</Typography.Text>
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
              ) : isReachedTwoAttemptsLeft ? (
                <InlineBanner
                  variant="error"
                  icon={<ErrorFilledCircleIcon />}
                  text={t("OneTimePasswordModal.errors.twoAttemptsLeft")}
                />
              ) : isReachedOneAttemptLeft ? (
                <InlineBanner
                  variant="error"
                  icon={<ErrorFilledCircleIcon />}
                  text={t("OneTimePasswordModal.errors.oneAttemptLeft")}
                />
              ) : null}
              {!isReachedMaxAttempts ? (
                <Typography.Text
                  size="callout"
                  color={isOtpExpired ? "primaryBase" : "neutralBase"}
                  onPress={() => {
                    handleOnRequestResendPress(otpParams.otpFormType);
                  }}
                  disabled={!isOtpExpired}>
                  {isOtpExpired
                    ? t("OneTimePasswordModal.resendCodeEnabled")
                    : t("OneTimePasswordModal.resendCodeDisabled", {
                        minutes: otpResetCountMinutes,
                        seconds: otpResetCountSeconds < 10 ? `0${otpResetCountSeconds}` : otpResetCountSeconds,
                      })}
                </Typography.Text>
              ) : null}
            </View>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorVisible}
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
const OTP_RESET_TIMEOUT_M = 1;
const OTP_RESET_TIMEOUT_S = 59;
const OTP_MAX_RESENDS = 3;
