import { startSmsHandling } from "@eabdullazyanov/react-native-sms-user-consent";
import { RouteProp, StackActions, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Keyboard, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import maskPhoneNumber from "@/utils/mask-phone-number";

import { useOtpValidation } from "../hooks/query-hooks";
import { OtpChallengeParams } from "../types";

export default function OneTimePasswordModal<ParamsT extends object, OutputT extends object>() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "OneTimePassword.OneTimePasswordModal">>();
  const otpValidationAsync = useOtpValidation<ParamsT, OutputT>(params.otpVerifyMethod);
  const { phoneNumber } = useAuthContext();

  const [otpParams, setOtpParams] = useState<OtpChallengeParams | undefined>(params.otpChallengeParams);
  const [isGenericErrorVisible, setIsGenericErrorVisible] = useState(false);
  const [isOtpCodeInvalidErrorVisible, setIsOtpCodeInvalidErrorVisible] = useState(false);
  const [isOTPVerifyMaxAttemptsReached, setIsOTPVerifyMaxAttemptsReached] = useState(false);
  const [isTempBlockModalVisible, setIsTempBlockModalVisible] = useState(false);
  const [otpResetCountSeconds, setOtpResetCountSeconds] = useState(OTP_RESET_COUNT_SECONDS);
  const [otpEnterNumberOfAttemptsLeft, setOtpEnterNumberOfAttemptsLeft] = useState(3);
  const [otpResendsRequested, setOtpResendsRequested] = useState(0);
  const [genericErrorMessage, setGenericErrorMessage] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [isResendOtpLoading, setIsResendOtpLoading] = useState(false);
  const [expiredErrorMessage, setExpiredErrorMessage] = useState(false);

  const isOtpExpired = otpResetCountSeconds <= 0;
  const isReachedMaxAttempts = otpResendsRequested === OTP_MAX_RESENDS && isOtpExpired;
  const resolvedPhoneNumber = phoneNumber ?? otpParams?.PhoneNumber;

  const isLoginFlow =
    params?.otpVerifyMethod === "login" ||
    params?.otpVerifyMethod === "reset-passcode" ||
    params?.otpVerifyMethod === "change-passcode" ||
    params?.otpVerifyMethod === "create-passcode" ||
    params?.otpVerifyMethod === "register-email" ||
    params?.otpVerifyMethod === "link-proxy-alias" ||
    params?.otpVerifyMethod === "optout-proxy-alias";

  const isUpdateCustomerProfileFlow = params?.otpVerifyMethod === "customers/communication-details";

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
    const stop = startSmsHandling(({ sms }: any) => {
      const pattern = /\b\d{4}\b/;
      const match = sms.match(pattern);

      const topFourDigits = match ? match[0] : sms;
      if (topFourDigits) {
        setCurrentValue(topFourDigits);
        handleOnSubmit(topFourDigits);
      }

      return stop();
    });
  }, []);
  // TODO: Remove on screen alert once the OTP service is ready (can be sent to the registered mobile phone)
  useEffect(() => {
    async function main() {
      if (
        params.otpOptionalParams !== undefined &&
        params.otpOptionalParams.isOtpAlreadySent !== undefined &&
        params.otpOptionalParams.isOtpAlreadySent
      ) {
        return;
      }

      try {
        const response = await params.onOtpRequest();
        // adding this to have initial object and new response.
        setOtpParams({ ...response, ...otpParams });
      } catch (error) {
        const errorCode = JSON.parse(JSON.stringify(error)).errorContent;

        if (errorCode.Errors[0].ErrorId === "0306") {
          setGenericErrorMessage(t("SadadBillPayments.EnterAccountNoScreen.genericError.globalLimitMessage"));
          setIsGenericErrorVisible(true);
        } else {
          setGenericErrorMessage(t("errors.generic.message"));
          setIsGenericErrorVisible(true);
        }

        warn("one-time-password", "Could not request OTP parameters: ", JSON.stringify(error));
        return error;
      }
    }

    main();
  }, [params]);

  useEffect(() => {
    if (isGenericErrorVisible || isReachedMaxAttempts) Keyboard.dismiss();
  }, [isGenericErrorVisible, isReachedMaxAttempts]);

  const handleOnCancel = (errorId?: string) => {
    // @ts-expect-error unable to properly add types for this call
    navigation.navigate(params.action.to, {
      ...params.action.params,
      otpResponseStatus: "cancel",
      otpResponseErrorId: errorId,
    });
  };

  const handleOnRequestResendPress = async () => {
    if (otpResendsRequested >= OTP_MAX_RESENDS) {
      return;
    }

    try {
      setIsResendOtpLoading(true);
      if (params.otpVerifyMethod === "cust_onboarding") {
        await otpValidationAsync.mutateAsync({
          mode: "01",
          correlationId: params.action.correlationId,
        });
      } else {
        const response = await params.onOtpRequest();
        setOtpParams({ ...response, ...otpParams });
      }

      setIsGenericErrorVisible(false);
      setIsOtpCodeInvalidErrorVisible(false);
      setOtpResetCountSeconds(OTP_RESET_COUNT_SECONDS);
      setCurrentValue("");
      setExpiredErrorMessage(false);
      setIsOTPVerifyMaxAttemptsReached(false);
    } catch (error) {
      warn("one-time-password", "Could not re-request OTP-code: ", JSON.stringify(error));
      setIsGenericErrorVisible(true);
    } finally {
      setOtpResendsRequested(current => current + 1);
      setIsResendOtpLoading(false);
      setOtpEnterNumberOfAttemptsLeft(3);
    }
  };

  const handleOnRequestBlockUserErrorClose = () => {
    // on (login flow | updating customer Profile mobile number | Goal Getter Flow) we blocked the user otherwise we navigate the user with fail status and then navigate back to first stack.
    if ((isReachedMaxAttempts && (isLoginFlow || isUpdateCustomerProfileFlow)) || isTempBlockModalVisible) {
      params.onUserBlocked?.();
    } else {
      // @ts-expect-error unable to properly add types for this call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    }
  };

  const handleOnRequestResendErrorClose = () => {
    setIsGenericErrorVisible(false);
    delayTransition(() => {
      // @ts-expect-error cannot type navigate call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    });
  };

  const handleOnChangeText = (value: string) => {
    // isOTPVerifyMaxAttemptsReached added to disable keyboard when max attempts reached till user tap resend code. PC-11791
    if (isReachedMaxAttempts || isOTPVerifyMaxAttemptsReached) return;

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
      const { Status, IsOtpValid, data, ...restProps } = await otpValidationAsync.mutateAsync({
        OtpId: otpParams?.OtpId,
        OtpCode: otpCode,
        optionalParams: params.otpOptionalParams as ParamsT,
        correlationId: params.action.correlationId,
        mode: "02",
      });

      if (
        Status === "OTP_MATCH_SUCCESS" ||
        Status === "success" ||
        Status === "BUY_OPERATION_SUCCESSFULLY_DONE" ||
        Status === "SELL_OPERATION_SUCCESSFULLY_DONE" ||
        IsOtpValid ||
        data?.IsOtpValid
      ) {
        // @ts-expect-error unable to properly add types for this call
        navigation.navigate(params.action.to, {
          ...params.action.params,
          otpResponseStatus: "success",
          otpResponsePayload: restProps,
        });
      } else {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");

        return;
      }
    } catch (error) {
      const errorId = error.errorContent?.Errors[0]?.ErrorId;
      if (params?.otpVerifyMethod === "cust_onboarding") {
        if (errorId === "0037" || errorId === "0045") {
          setOtpEnterNumberOfAttemptsLeft(pre => pre - 1);
        } else if (errorId === "0038") {
          setGenericErrorMessage(t("OneTimePasswordModal.errors.optInvalidTooMany"));
          setIsGenericErrorVisible(true);
        }
        setCurrentValue("");
        return;
      }
      if (error.errorContent?.Errors[0]?.ErrorId === "0125") {
        handleOnCancel("0125");
      } else if (
        params?.otpVerifyMethod === "aio-card/pin-change/otp-validation" &&
        error.errorContent?.Errors[0]?.ErrorId === "0032"
      ) {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
      } else if (
        params?.otpVerifyMethod === "aio-card/pin-change/otp-validation" &&
        error.errorContent?.Errors[0]?.ErrorId === "0033"
      ) {
        setIsOtpCodeInvalidErrorVisible(true);
        setIsOTPVerifyMaxAttemptsReached(true);
      } else if (error.errorContent?.Errors[0]?.ErrorId === "0102") {
        setExpiredErrorMessage(true);
      } else if (error.errorContent?.Errors[0]?.ErrorId === "0009") {
        setIsTempBlockModalVisible(true);
      } else if (
        // TODO: These error IDs added here temporally in the future we will be receiving single error id for every flow
        error.errorContent?.Errors[0]?.ErrorId === "0013" ||
        error.errorContent?.Errors[0]?.ErrorId === "0037" ||
        error.errorContent?.Errors[0]?.ErrorId === "0045" ||
        error.errorContent?.Errors[0]?.ErrorId === "0023" ||
        error.errorContent?.Errors[0]?.ErrorId === "0103" ||
        error.errorContent?.Errors[0]?.ErrorId === "0030" ||
        error.errorContent?.Errors[0]?.ErrorId === "0033"
      ) {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
      } else if (
        // TODO: These error IDs added here temporally in the future we will be receiving single error id for every flow
        error.errorContent?.Errors[0]?.ErrorId === "0038" ||
        error.errorContent?.Errors[0]?.ErrorId === "0024" ||
        error.errorContent?.Errors[0]?.ErrorId === "0024" ||
        error.errorContent?.Errors[0]?.ErrorId === "0031" ||
        error.errorContent?.Errors[0]?.ErrorId === "0034"
      ) {
        setIsOtpCodeInvalidErrorVisible(true);
        setIsOTPVerifyMaxAttemptsReached(true);
      } else if (error.errorContent?.Errors[0].ErrorId === "0037") {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
      } else if (error.errorContent?.Errors[0].ErrorId === "0025") {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
      } else if (error.errorContent?.Errors[0].ErrorId === "0088") {
        setGenericErrorMessage("OneTimePasswordModal.errors.transferRestrictionError");
        setIsGenericErrorVisible(true);
        setCurrentValue("");
      } else if (error.errorContent?.Errors[0].ErrorId === "0021") {
        setGenericErrorMessage(t("OneTimePasswordModal.errors.otpValidationFailed"));
        setIsGenericErrorVisible(true);
        setCurrentValue("");
      } else if (error.errorContent?.Errors[0].ErrorId === "0083") {
        setCurrentValue("");
        handleOnCancel(error.errorContent?.Errors[0].ErrorId);
      } else {
        setGenericErrorMessage(t("errors.generic.tryAgainLater"));
        setIsGenericErrorVisible(true);
        setCurrentValue("");
        warn("one-time-password", "Could not validate OTP-code with backend: ", JSON.stringify(error));
      }
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
              {otpParams.Email ? (
                <Typography.Text size="callout">
                  {t("OneTimePasswordModal.emailMessage", {
                    email: otpParams.Email,
                  })}
                </Typography.Text>
              ) : (
                <Typography.Text size="callout">
                  {t("OneTimePasswordModal.phoneNumberMessage", {
                    phoneNumber: resolvedPhoneNumber ? maskPhoneNumber(resolvedPhoneNumber, 4) : null,
                  })}
                </Typography.Text>
              )}

              <View style={otpContainerStyle}>
                <PincodeInput
                  autoComplete="one-time-code"
                  autoFocus
                  isEditable={!isReachedMaxAttempts && otpEnterNumberOfAttemptsLeft !== 0}
                  isError={isReachedMaxAttempts || isOtpCodeInvalidErrorVisible}
                  onChangeText={handleOnChangeText}
                  length={OTP_CODE_LENGTH}
                  value={currentValue}
                />
                {!isOtpExpired &&
                  otpEnterNumberOfAttemptsLeft > 0 &&
                  (otpEnterNumberOfAttemptsLeft === 2 ? (
                    <Alert variant="error" message={t("OneTimePasswordModal.errors.otp2AttemptsLeft")} />
                  ) : otpEnterNumberOfAttemptsLeft === 1 ? (
                    <Alert variant="error" message={t("OneTimePasswordModal.errors.otp1AttemptsLeft")} />
                  ) : null)}
                {!isOtpExpired && otpEnterNumberOfAttemptsLeft === 0 ? (
                  <Alert variant="error" message={t("OneTimePasswordModal.errors.codehasExpired")} />
                ) : null}
                {isOtpCodeInvalidErrorVisible && !isOtpExpired ? (
                  <>
                    {isOTPVerifyMaxAttemptsReached ? (
                      <Alert
                        variant="error"
                        message={t("OneTimePasswordModal.errors.maxAttemptsInvalidPasswordReached")}
                      />
                    ) : (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.invalidPassword")} />
                    )}
                  </>
                ) : expiredErrorMessage ? (
                  <>
                    {otpResendsRequested === 0 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.twoExpiredAttemptsLeft")} />
                    ) : otpResendsRequested === 1 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.oneExpiredAttemptLeft")} />
                    ) : null}
                  </>
                ) : null}
                {isOtpExpired ? (
                  <>
                    {otpResendsRequested === 0 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.twoAttemptsLeft")} />
                    ) : otpResendsRequested === 1 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.oneAttemptLeft")} />
                    ) : (
                      <Alert
                        variant="error"
                        message={t("OneTimePasswordModal.errors.maxAttemptsInvalidPasswordReached")}
                      />
                    )}
                  </>
                ) : null}
                {otpResendsRequested <= OTP_MAX_RESENDS ? (
                  isResendOtpLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
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
                  )
                ) : null}
              </View>
            </Stack>
          </ContentContainer>
        ) : (
          <View style={styles.indicatorContainerStyle}>
            <ActivityIndicator />
          </View>
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={genericErrorMessage}
        isVisible={isGenericErrorVisible}
        onClose={handleOnRequestResendErrorClose}
      />
      <NotificationModal
        variant="error"
        title={
          params?.otpVerifyMethod === "cust_onboarding"
            ? t("OneTimePasswordModal.errors.onboardingErrorModalTitle")
            : t("OneTimePasswordModal.errors.noAttemptsLeftTitle")
        }
        message={
          params?.otpVerifyMethod === "cust_onboarding"
            ? t("OneTimePasswordModal.errors.onboardingErrorModalMessage")
            : t("OneTimePasswordModal.errors.noAttemptsLeftMessage")
        }
        isVisible={isReachedMaxAttempts || isTempBlockModalVisible}
        onClose={handleOnRequestBlockUserErrorClose}
        buttons={{
          primary: (
            <Button onPress={handleOnRequestBlockUserErrorClose}>
              {params?.otpVerifyMethod === "cust_onboarding"
                ? t("OneTimePasswordModal.errors.goBack")
                : t("errors.generic.button")}
            </Button>
          ),
        }}
      />
      {/* for AIO card PIN change  */}
      <NotificationModal
        variant="error"
        title={t("OneTimePasswordModal.errors.noAttemptsLeftTitle")}
        message={t("OneTimePasswordModal.errors.noAttemptsLeftMessage")}
        isVisible={isOTPVerifyMaxAttemptsReached && params?.otpVerifyMethod === "aio-card/pin-change/otp-validation"}
        onClose={handleOnRequestBlockUserErrorClose}
        buttons={{
          primary: (
            <Button
              onPress={() => {
                navigation.dispatch(StackActions.pop(3));
                navigation.navigate("Home.HomeTabs", { screen: "Cards" });
              }}>
              {t("errors.generic.button")}
            </Button>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  indicatorContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const OTP_CODE_LENGTH = 4;
const OTP_MAX_RESENDS = 2;
const OTP_RESET_COUNT_SECONDS = 120;
