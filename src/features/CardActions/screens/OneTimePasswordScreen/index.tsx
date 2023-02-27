import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import CountdownLink from "./CountdownLink";

export default function OneTimePasswordScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [countdownRestart, setCountdownRestart] = useState(false);

  const handleOnClosePress = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnResendPress = () => {
    setCountdownRestart(true);
    Alert.alert("Resend OTP");
  };

  const handleOnSendOTPPress = () => {
    setCountdownRestart(true);
  };

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
      <ContentContainer>
        <Typography.Text>Card OTP</Typography.Text>
        <Button onPress={handleOnSendOTPPress}>OTP</Button>
        <CountdownLink
          restart={countdownRestart}
          timeInSecond={120}
          link={t("CardActions.OneTimePasswordScreen.resendCode")}
          onPress={handleOnResendPress}
        />
      </ContentContainer>
    </Page>
  );
}
