import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { NAFATH_ANDROID_URL, NAFATH_APPLE_URL, NAFATH_DEEPLINK_ANDROID, NAFATH_DEEPLINK_IOS } from "@/constants";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useRequestNumber } from "../hooks/query-hooks";

export default function NafathCodeScreen() {
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = useRequestNumber();
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const [requestedNumber, setRequestedNumber] = useState<number | undefined>(undefined);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  const handleOnToggleModal = async () => {
    try {
      const response = await mutateAsync();
      const randomValue = response.Body?.random || "";
      setRequestedNumber(parseInt(randomValue, 10));
    } catch (err) {}
  };

  useEffect(() => {
    handleOnToggleModal();
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
    setIsButtonPressed(true);
    setTimeout(() => {
      navigation.navigate("Onboarding.ConfirmDetails");
      setIsButtonPressed(false);
    }, 10000);
  };

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  }));

  const infoContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("NafathCodeScreen.title")}
        testID="Onboarding.NafathAuthScreen:NavHeader"
      />
      {isLoading || isButtonPressed ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <Stack justify="center" align="center" direction="vertical" flex={1} gap="32p">
          <View style={numberContainerStyle}>
            <Typography.Text color="neutralBase-50" weight="bold" size="title1" align="center">
              {requestedNumber}
            </Typography.Text>
          </View>
          <Stack direction="vertical" gap="16p" align="center" style={infoContainerStyle}>
            <Typography.Text color="neutralBase+30" weight="medium" size="title2" align="center">
              {t("NafathCodeScreen.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" weight="regular" size="callout" align="center">
              {t("NafathCodeScreen.description")}
            </Typography.Text>
          </Stack>
          <View style={styles.buttonContainerStyle}>
            <Button onPress={handleOnOpenNafathApp}>{t("NafathCodeScreen.buttonTitle")}</Button>
          </View>
        </Stack>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    bottom: 25,
    position: "absolute",
    width: "90%",
  },
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
