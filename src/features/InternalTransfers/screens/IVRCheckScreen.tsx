import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, TextStyle } from "react-native";

import { PhoneFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import DialIcon from "../assets/dial-icon";

export default function IVRCheckScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [count, setCount] = useState(4);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const randomDialInNumber = useRef(Math.floor(Math.random() * 10)).current;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(value => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOnCloseModal = () => {
    setIsCancelModalVisible(false);
    setIsErrorModalVisible(!isErrorModalVisible);
  };

  const handleOnCancelPress = () => {
    setIsCancelModalVisible(true);
  };

  const textLineMargin = useThemeStyles<TextStyle>(theme => ({
    marginLeft: theme.spacing["5p"],
  }));

  const phoneFilledIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <ContentContainer style={styles.containerStyle}>
          <Stack align="center" direction="vertical" gap="10p">
            <Typography.Text color="primaryBase" weight="semiBold" size="title1">
              {t("InternalTransfers.IVRCheckScreen.wellCallYouTitle")}
            </Typography.Text>
            <Typography.Text align="center" color="primaryBase" weight="regular" size="callout">
              {t("InternalTransfers.IVRCheckScreen.callReceiveMessage")}
            </Typography.Text>
            <Pressable
              onPress={() => navigation.navigate("InternalTransfers.WaitingVerificationScreen")}
              style={styles.callingYouViewStyle}>
              {count === 0 ? (
                <>
                  <PhoneFilledIcon color={phoneFilledIconColor} />
                  <Typography.Text style={textLineMargin} color="neutralBase" weight="regular" size="callout">
                    {t("InternalTransfers.IVRCheckScreen.callingYouTitle")}
                  </Typography.Text>
                </>
              ) : (
                <>
                  <ActivityIndicator size="small" />
                  <Typography.Text style={textLineMargin} color="neutralBase" weight="regular" size="callout">
                    {t("InternalTransfers.IVRCheckScreen.callingInMessage")} {count}{" "}
                    {t("InternalTransfers.IVRCheckScreen.seconds")}
                  </Typography.Text>
                </>
              )}
            </Pressable>
          </Stack>
          <Stack align="center" direction="vertical" gap="8p">
            <DialIcon />
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {t("InternalTransfers.IVRCheckScreen.dialInMessage")} “{randomDialInNumber}”
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="regular" size="callout">
              {t("InternalTransfers.IVRCheckScreen.toConfirmMessage")}
            </Typography.Text>
          </Stack>
          <Stack align="center" direction="vertical" gap="4p">
            <Alert message={t("InternalTransfers.IVRCheckScreen.instructionMessage")} variant="default" />
            <Pressable onPress={handleOnCancelPress}>
              <Typography.Text style={styles.cancelTextStyle} color="primaryBase" weight="regular" size="callout">
                {t("InternalTransfers.IVRCheckScreen.cancel")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={handleOnCloseModal}>{t("InternalTransfers.IVRCheckScreen.confirmCancellation")}</Button>
          ),
          secondary: <Button onPress={handleOnCloseModal}>{t("InternalTransfers.IVRCheckScreen.close")}</Button>,
        }}
        message={t("InternalTransfers.IVRCheckScreen.cancelIvrWarningMessage")}
        isVisible={isCancelModalVisible}
        title={t("InternalTransfers.IVRCheckScreen.cancelBeneficiaryTitle")}
        variant="confirmations"
      />
      <NotificationModal
        buttons={{
          primary: <Button onPress={handleOnCloseModal}>{t("InternalTransfers.IVRCheckScreen.close")}</Button>,
        }}
        message={t("InternalTransfers.IVRCheckScreen.ivrFailureMessage")}
        isVisible={isErrorModalVisible}
        title={t("InternalTransfers.IVRCheckScreen.ivrFailureTitle")}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  callingYouViewStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelTextStyle: {
    alignSelf: "center",
    textAlign: "center",
  },
  containerStyle: {
    justifyContent: "space-between",
  },
});
