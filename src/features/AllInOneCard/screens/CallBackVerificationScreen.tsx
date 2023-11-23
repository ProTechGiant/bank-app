import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import DialIcon from "@/assets/icons/DialIcon";
import PhoneCallBackIcon from "@/assets/icons/PhoneCallBackIcon";
import { AlertBox } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { MAXIMUM_CALL_VERIFICATION_LIMIT } from "../constants";
import { DIAL_NUMBER } from "./../mocks/index";

export default function CallBackVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isCallCanceled, setIsCallCanceled] = useState<boolean>(false);
  const [numberOfCalls, setNumberOfCalls] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [enteredNumber, setEnteredNumber] = useState<string>("");
  const initialTime = 5; // TODO: set Timer according API
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunningNow, setIsRunningNow] = useState<boolean>(false);

  const handleCalling = useCallback(() => {
    setIsCallCanceled(false);
    if (numberOfCalls < MAXIMUM_CALL_VERIFICATION_LIMIT) {
      setNumberOfCalls(numberOfCalls + 1);
    }
  }, [numberOfCalls, setNumberOfCalls, setIsCallCanceled]);

  const handlePressNumber = (value: string) => {
    setEnteredNumber(value);
    setShowAlert(false);
    if (Number(value) === DIAL_NUMBER) {
      navigation.navigate("AllInOneCard.WaitingActivationScreen");
    } else {
      setIsErrorModalVisible(true);
    }
    setEnteredNumber("");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    if (timeLeft === 0 && numberOfCalls < 4) {
      setIsRunningNow(true);
    }
    return () => {
      clearInterval(timer);
    };
  }, [handleCalling, navigation, numberOfCalls, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleRequestNewCall = () => {
    setTimeLeft(initialTime);
    setNumberOfCalls(numberOfCalls + 1);
    setIsErrorModalVisible(false);
  };

  const handleOnCancelPress = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const handleViewCard = () => {
    setNumberOfCalls(0);
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["64p"],
  }));

  const textContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const textPaddingStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <ContentContainer style={containerStyle}>
          <Stack direction="vertical" justify="space-between" align="center" flex={1}>
            <Stack align="center" direction="vertical" gap="16p" justify="space-between">
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("AllInOneCard.CallBackVerificationScreen.wellCallYouTitle")}
              </Typography.Text>
              <Typography.Text align="center" color="neutralBase+10" weight="regular" size="callout">
                {t("AllInOneCard.CallBackVerificationScreen.callReceiveMessage")}
              </Typography.Text>
              <View style={textPaddingStyle}>
                {isCallCanceled ? (
                  <></>
                ) : minutes === 0 && seconds === 0 ? (
                  <Typography.Text color="neutralBase-20" weight="regular" size="body">
                    {t("AllInOneCard.CallBackVerificationScreen.callingYouTitle")}
                  </Typography.Text>
                ) : (
                  <Typography.Text color="neutralBase-20" weight="regular" size="body">
                    {t("AllInOneCard.CallBackVerificationScreen.callingInMessage")} {String(minutes).padStart(1, "0")}:
                    {String(seconds).padStart(2, "0")} {t("AllInOneCard.CallBackVerificationScreen.seconds")}
                  </Typography.Text>
                )}
              </View>
            </Stack>
            {isCallCanceled ? (
              <Stack align="center" direction="vertical" gap="8p">
                <PhoneCallBackIcon />
                <Stack direction="horizontal" align="center" justify="center">
                  <Typography.Text color="neutralBase" size="callout" weight="regular" style={textContainerStyle}>
                    {t("AllInOneCard.CallBackVerificationScreen.noCallReceived")}
                    <Typography.Text
                      color="primaryBase-30"
                      weight="medium"
                      size="footnote"
                      style={styles.underline}
                      onPress={() => {
                        setIsCallCanceled(false);

                        handleRequestNewCall();
                      }}>
                      {t("AllInOneCard.CallBackVerificationScreen.newCall")}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            ) : (
              <Stack align="center" direction="vertical" gap="8p">
                <DialIcon />
                <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={textContainerStyle}>
                  {t("AllInOneCard.CallBackVerificationScreen.dialInMessage")} “{DIAL_NUMBER}”
                </Typography.Text>
                <Typography.Text color="primaryBase" weight="regular" size="callout">
                  {t("AllInOneCard.CallBackVerificationScreen.toConfirmMessage")}
                </Typography.Text>
              </Stack>
            )}
            <Stack align="center" direction="vertical" gap="48p" justify="center">
              <AlertBox description={t("AllInOneCard.CallBackVerificationScreen.instructionMessage")} />
              <Pressable onPress={handleOnCancelPress} style={buttonStyle}>
                <Typography.Text color="primaryBase" weight="regular" size="callout">
                  {t("AllInOneCard.CallBackVerificationScreen.cancel")}
                </Typography.Text>
              </Pressable>
            </Stack>
          </Stack>
          {showAlert ? (
            <TextInput
              placeholder="Enter a number"
              value={enteredNumber}
              onChangeText={value => handlePressNumber(value)}
              keyboardType="numeric"
            />
          ) : (
            <></>
          )}
        </ContentContainer>
      </Page>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={handleRequestNewCall}>
              {t("AllInOneCard.CallBackVerificationScreen.errorModal.newCallButton")}
            </Button>
          ),
        }}
        message={t("AllInOneCard.CallBackVerificationScreen.errorModal.content")}
        isVisible={isErrorModalVisible}
        title={t("AllInOneCard.CallBackVerificationScreen.errorModal.title")}
        variant="error"
      />
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={handleViewCard}>
              {t("AllInOneCard.CallBackVerificationScreen.maximumCallErrorModal.viewCardButton")}
            </Button>
          ),
        }}
        message={t("AllInOneCard.CallBackVerificationScreen.maximumCallErrorModal.content")}
        isVisible={numberOfCalls === 4}
        title={t("AllInOneCard.CallBackVerificationScreen.maximumCallErrorModal.title")}
        variant="error"
      />

      {/* Test MODAL */}
      <NotificationModal
        buttons={{
          primary: (
            <Button
              onPress={() => {
                setShowAlert(true);
                setIsRunningNow(false);
              }}>
              Accept
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => {
                setIsRunningNow(false);
                setIsCallCanceled(true);
              }}>
              Cancel
            </Button>
          ),
        }}
        message="..."
        isVisible={isRunningNow}
        title="New Call "
        variant="success"
      />
    </>
  );
}

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: "underline",
  },
});
