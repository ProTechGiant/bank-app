//TODO; make it a common component FOR ONBOARDING AND SIGN IN

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StyleSheet, View, ViewStyle } from "react-native";

import Accordion from "@/components/Accordion";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LinkCard, LinkModal } from "@/components/LinkComponent";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { NAFATH_ANDROID_URL, NAFATH_APPLE_URL, NAFATH_DEEPLINK_ANDROID, NAFATH_DEEPLINK_IOS } from "@/constants";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGetCustomerDetails, useRequestNumber } from "../hooks/query-hooks";

export default function NafathAuthScreen() {
  const { t } = useTranslation();
  const { mutateAsync } = useRequestNumber();
  const { data: customerDetails, refetch: refetchCustomerDetails } = useGetCustomerDetails();

  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const [isModalVisible, setIsModalVisible] = useState();

  const [requestedOtpNumber, setRequestedOtpNumber] = useState<number | undefined>();
  const [isIndicator, setIsIndicator] = useState<boolean>(false);

  const handleOnToggleModal = async () => {
    const isVisible = !isModalVisible;

    setIsModalVisible(isVisible);
    try {
      if (isVisible) {
        setIsIndicator(true);
        const response = await mutateAsync();
        setIsIndicator(false);
        const randomValue = response.Body?.random || "";
        setRequestedOtpNumber(parseInt(randomValue, 10));
      }
    } catch (err) {
      setIsIndicator(false);
      //TODO: remove it when API will be working
      setRequestedOtpNumber(10);
    }
  };

  useEffect(() => {
    try {
      if (requestedOtpNumber && customerDetails === undefined) {
        refetchCustomerDetails();
      }
    } catch (err) {
      setIsIndicator(false);
      warn("Fetch Customer Error", JSON.stringify(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenNafathApp = async (url: string) => {
    try {
      if ((await Linking.canOpenURL(url)) === false) {
        Alert.alert(t("NafathAuthScreen.alertModelTitle"), t("NafathAuthScreen.alertModelMessage"), [
          {
            text: t("NafathAuthScreen.alertModelCancelButton"),
            style: "cancel",
          },
          {
            text:
              Platform.OS === "android"
                ? t("NafathAuthScreen.alertModelPlayStoreButton")
                : t("NafathAuthScreen.alertModelAppStoreButton"),
            onPress: async () => {
              const storeURL = Platform.OS === "android" ? NAFATH_ANDROID_URL : NAFATH_APPLE_URL;

              /* await */ Linking.openURL(storeURL);
              handleNavigate();
            },
          },
        ]);

        return;
      }

      await Linking.openURL(url);
      handleNavigate();
    } catch (error) {
      warn("nafath", "Could not open Nafath app: ", JSON.stringify(error));
    }
  };

  const handleOnOpenNafathApp = () => {
    const url = Platform.OS === "android" ? NAFATH_DEEPLINK_ANDROID : NAFATH_DEEPLINK_IOS;
    handleOpenNafathApp(url);
  };
  const handleNavigate = () => {
    //TODO: this block is added for testing purpose will update it after testing
    setIsIndicator(true);
    setTimeout(() => {
      setIsIndicator(false);
      navigation.navigate("SignIn.CreatePasscode");
    }, 10000);
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    flex: 1,
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
  }));

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["32p"],
  }));

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    backgroundColor: theme.palette["primaryBase-30"],
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["16p"],
    width: 60,
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={t("NafathAuthScreen.navHeaderTitle")}
        testID="SignIn.NafathAuthScreen:NavHeader"
      />
      {isIndicator ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <View style={container}>
          {requestedOtpNumber ? (
            <LinkModal
              modalVisible={isModalVisible}
              linkText={t("NafathAuthScreen.modalLink")}
              onNavigate={handleOnOpenNafathApp}
              toggleModal={handleOnToggleModal}>
              <Stack align="center" direction="vertical" justify="center">
                {requestedOtpNumber !== undefined ? (
                  <View style={numberContainerStyle}>
                    <Typography.Text color="neutralBase-50" weight="bold" size="title1" align="center">
                      {requestedOtpNumber}
                    </Typography.Text>
                  </View>
                ) : (
                  <View style={loadingContainerStyle}>
                    <Typography.Text color="neutralBase" weight="bold" size="title1" align="center">
                      {t("NafathAuthScreen.modalLoad")}
                    </Typography.Text>
                  </View>
                )}
                <Typography.Text color="neutralBase" size="callout" align="center">
                  {t("NafathAuthScreen.modalBody")}
                </Typography.Text>
              </Stack>
            </LinkModal>
          ) : null}
          <View style={headerContainerStyle}>
            <Typography.Text size="title1" weight="bold">
              {t("NafathAuthScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular">
              {t("NafathAuthScreen.subTitle")}
            </Typography.Text>
          </View>
          <Stack align="stretch" direction="vertical" gap="20p">
            <LinkCard onNavigate={handleOnToggleModal} testID="SignIn.NafathAuthScreen:SelectNafathAppButton">
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {t("NafathAuthScreen.appButtonTitle")}
                <Typography.Text weight="regular" size="footnote">
                  {t("NafathAuthScreen.appButtonSubtitle")}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase">
                {t("NafathAuthScreen.appButtonBody")}
              </Typography.Text>
            </LinkCard>
            <Accordion title={t("NafathAuthScreen.dropdownTitle")}>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("NafathAuthScreen.dropdownBody")}
              </Typography.Text>
            </Accordion>
          </Stack>
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
