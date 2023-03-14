import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useOtpValidation, useRequestViewPinOtp } from "../../query-hooks";
import CountdownLink from "./CountdownLink";
import PinInput from "./PinInput";

export default function OneTimePasswordModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.OneTimePasswordModal">>();

  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const otpValidationAsync = useOtpValidation();

  const [countdownRestart, setCountdownRestart] = useState(true);
  // @TODO: use setIsPinFocus to hide keyboard if error returns
  const [isPinFocus, setIsPinFocus] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isReachedMaxAttempts, setIsReachedMaxAttempts] = useState(false);

  useEffect(() => {
    if (undefined === route.params) return;
    setOtpId(route.params.otp.otpId);
  }, [route.params]);

  const requestViewPinOtp = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await requestViewPinOtpAsync.mutateAsync({
        cardId: route.params.cardId,
        correlationId: correlationId,
      });
      setOtpId(response.OtpId);
      setCountdownRestart(true);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not request view pin OTP: ", JSON.stringify(error));
    }
  };

  const handleOnClosePress = () => {
    navigation.goBack();
  };

  const handleOnResendPress = async () => {
    if (route.params.action === "view-pin") {
      requestViewPinOtp();
    } // TODO: request new otp for other actions
  };

  const handleOnPinBoxesPress = () => {
    setIsPinFocus(true);
    // reset pin boxes styles and remove error message
    setIsError(false);
  };

  const handleOnSubmit = async (input: string) => {
    try {
      const response = await otpValidationAsync.mutateAsync({
        CardId: route.params.cardId,
        OtpCode: input,
        OtpId: otpId,
        correlationId: route.params.correlationId,
      });
      if (response.IsOtpValid) {
        navigation.navigate(route.params.redirect, {
          action: route.params.action,
          pin: response.Pin,
          cardId: route.params.cardId,
        });
      } else {
        setIsReachedMaxAttempts(response.NumOfAttempts >= 3);
        setIsInvalidPassword(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not validate OTP: ", JSON.stringify(error));
    }
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const passwordContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  const errorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.palette["errorBase-40"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <>
      <Page insets={["bottom"]} backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
        <ContentContainer>
          <Stack direction="vertical" gap="16p">
            <Typography.Text size="title1" weight="semiBold">
              {t("CardActions.OneTimePasswordModal.title")}
            </Typography.Text>
            <Typography.Text size="callout">
              {t("CardActions.OneTimePasswordModal.message", {
                hiddenNumber: "\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022",
                phoneNumber: route.params.otp.phoneNumber.slice(-2),
              })}
            </Typography.Text>
            <View style={passwordContainerStyle}>
              <PinInput
                pinLength={4}
                isError={isError}
                isFocus={isPinFocus}
                onSubmit={handleOnSubmit}
                onPress={handleOnPinBoxesPress}
              />
            </View>

            {isInvalidPassword || isReachedMaxAttempts ? (
              <View style={errorContainerStyle}>
                <ErrorIcon height={20} width={20} />
                <Typography.Text size="footnote" color="errorBase" style={styles.errorMessage}>
                  {isReachedMaxAttempts
                    ? t("CardActions.OneTimePasswordModal.errors.reachedMaxAttempts")
                    : t("CardActions.OneTimePasswordModal.errors.invalidPassword")}
                </Typography.Text>
              </View>
            ) : null}
          </Stack>

          {!isReachedMaxAttempts ? (
            <View style={styles.counterContainer}>
              <CountdownLink
                restart={countdownRestart}
                timeInSecond={120}
                link={t("CardActions.OneTimePasswordModal.resendCode")}
                onPress={handleOnResendPress}
              />
            </View>
          ) : null}
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={handleOnErrorModalClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  counterContainer: {
    marginVertical: 12,
  },
  errorMessage: {
    flex: 1,
    marginLeft: 14,
  },
});
