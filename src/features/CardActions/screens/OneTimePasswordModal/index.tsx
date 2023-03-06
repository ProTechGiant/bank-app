import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../../CardActionsStack";
import CountdownLink from "./CountdownLink";
import PinInput from "./PinInput";

export default function OneTimePasswordModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.OneTimePasswordModal">>();

  const [countdownRestart, setCountdownRestart] = useState(true);
  // @TODO: use setIsPinFocus to hide keyboard if error returns
  const [isPinFocus, setIsPinFocus] = useState(true);
  const [isError, setIsError] = useState(false);

  const phoneNumber = "89"; // @TODO get from BE

  const handleOnClosePress = () => {
    navigation.goBack();
  };

  const handleOnResendPress = () => {
    setCountdownRestart(true);
    Alert.alert("Resend OTP");
  };

  const handleOnPinBoxesPress = () => {
    setIsPinFocus(true);
    // reset pin boxes styles and remove error message
    setIsError(false);
  };

  const handleOnSubmit = (input: string) => {
    console.log(`OTP: ${input}`); // @TODO: BE integration, go to next screen to do next action if password is correct
    navigation.navigate(route.params.redirect, { action: route.params.action });
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
    <Page insets={["bottom"]} backgroundColor="neutralBase-50">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
      <ContentContainer>
        <Stack direction="vertical" gap="16p">
          <Typography.Text size="title1" weight="semiBold">
            {t("CardActions.OneTimePasswordModal.title")}
          </Typography.Text>
          <Typography.Text size="callout">
            {t("CardActions.OneTimePasswordModal.message", {
              hiddenNumber: "\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022",
              phoneNumber: phoneNumber,
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
          {isError && (
            <View style={errorContainerStyle}>
              <ErrorIcon height={20} width={20} />
              <Typography.Text size="footnote" color="errorBase" style={styles.errorMessage}>
                {t("CardActions.OneTimePasswordModal.errors.invalidPassword")}
              </Typography.Text>
            </View>
          )}
        </Stack>
        <View style={styles.counterContainer}>
          <CountdownLink
            restart={countdownRestart}
            timeInSecond={120}
            link={t("CardActions.OneTimePasswordModal.resendCode")}
            onPress={handleOnResendPress}
          />
        </View>
      </ContentContainer>
    </Page>
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
