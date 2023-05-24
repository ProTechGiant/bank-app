import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import LoaderModal from "@/features/Onboarding/components/LoaderModal";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LinkCard, LinkModal } from "../components";
import { NAFATH_ANDROID_URL, NAFATH_APPLE_URL, NAFATH_DEEPLINK_ANDROID, NAFATH_DEEPLINK_IOS } from "../constants";
import { useRequestNumber } from "../hooks/query-hooks";

export default function NafathAuthScreen() {
  const { t } = useTranslation();
  const requestOtpNumberAsync = useRequestNumber();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [requestedOtpNumber, setRequestedOtpNumber] = useState<number | undefined>();
  const [isIndicator, setIsIndicator] = useState<boolean>(false);

  const handleOnToggleModal = async () => {
    const nextValue = !isModalVisible;
    setIsModalVisible(nextValue);

    if (nextValue) {
      setIsIndicator(true);
      const response = await requestOtpNumberAsync.mutateAsync();
      const randomValue = response.Body?.random || "";
      setIsIndicator(false);
      setRequestedOtpNumber(parseInt(randomValue, 10));
    }
  };

  const handleOpenNafathApp = async (Url: string) => {
    Linking.canOpenURL(Url)
      .then(supported => {
        if (supported) {
          Linking.openURL(Url);
          handleNavigate();
        } else {
          Alert.alert(
            t("Onboarding.NafathAuthScreen.alertModelTitle"),
            t("Onboarding.NafathAuthScreen.alertModelMessage"),
            [
              {
                text: t("Onboarding.NafathAuthScreen.alertModelCancelButton"),
                onPress: () => warn("Cancel Pressed", ""),
                style: "cancel",
              },
              {
                text: t("Onboarding.NafathAuthScreen.alertModelAppStoreButton"),
                onPress: () => {
                  if (Platform.OS === "android") {
                    handleOpenNafathApp(NAFATH_ANDROID_URL);
                  } else if (Platform.OS === "ios") {
                    handleOpenNafathApp(NAFATH_APPLE_URL);
                  }
                  handleNavigate();
                },
              },
            ]
          );
        }
      })
      .catch(error => warn("ERROR", JSON.stringify(error)));
  };

  const handleOnOpenNafathApp = () => {
    if (Platform.OS === "android") {
      handleOpenNafathApp(NAFATH_DEEPLINK_ANDROID);
    } else if (Platform.OS === "ios") {
      handleOpenNafathApp(NAFATH_DEEPLINK_IOS);
    }
  };
  const handleNavigate = () => {
    //TODO: this block is added for testing purpose will update it after testing
    setIsIndicator(true);
    setTimeout(() => {
      setIsIndicator(false);
      navigation.navigate("Onboarding.ConfirmDetails");
    }, 6000);
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
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
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginVertical: theme.spacing["32p"],
    width: 60,
  }));
  return (
    <Page>
      <NavHeader withBackButton={true} title={t("Onboarding.NafathAuthScreen.navHeaderTitle")} />
      <View style={container}>
        {isIndicator ? (
          <LoaderModal loading={isIndicator} />
        ) : (
          <>
            <LinkModal
              modalVisible={isModalVisible}
              linkText={t("Onboarding.NafathAuthScreen.modalLink")}
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
                      {t("Onboarding.NafathAuthScreen.modalLoad")}
                    </Typography.Text>
                  </View>
                )}
                <Typography.Text color="neutralBase" size="footnote" weight="semiBold" align="center">
                  {t("Onboarding.NafathAuthScreen.modalBody")}
                </Typography.Text>
              </Stack>
            </LinkModal>
            <View style={headerContainerStyle}>
              <Typography.Text size="large" weight="bold">
                {t("Onboarding.NafathAuthScreen.title")}
              </Typography.Text>
            </View>
            <Stack align="stretch" direction="vertical" gap="20p">
              <LinkCard onNavigate={handleOnToggleModal}>
                <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                  {t("Onboarding.NafathAuthScreen.appButtonTitle")}
                  <Typography.Text weight="regular" size="footnote">
                    {t("Onboarding.NafathAuthScreen.appButtonSubtitle")}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text size="footnote" color="neutralBase">
                  {t("Onboarding.NafathAuthScreen.appButtonBody")}
                </Typography.Text>
              </LinkCard>
              {/* <LinkCard onNavigate={handleOnOpenNafathWebsite}>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("Onboarding.NafathAuthScreen.siteButtonTitle")}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {t("Onboarding.NafathAuthScreen.siteButtonBody")}
            </Typography.Text>
          </LinkCard>
          <Accordion title={t("Onboarding.NafathAuthScreen.dropdownTitle")}>
            <Typography.Text color="neutralBase+10" size="footnote">
              {t("Onboarding.NafathAuthScreen.dropdownBody")}
            </Typography.Text>
          </Accordion>
          </LinkCard> */}
            </Stack>
          </>
        )}
      </View>
    </Page>
  );
}
