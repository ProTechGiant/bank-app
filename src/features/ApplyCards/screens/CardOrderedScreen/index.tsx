import * as React from "react";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, Platform, StatusBar, StyleSheet, View } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import BackgroundBottomSvg from "../../background-bottom.svg";
import BackgrounTopStartSvg from "../../background-top-start.svg";

export default function CardOrderedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnAddToWallet = () => {
    Platform.OS === "ios"
      ? navigation.navigate("ApplyCards.AddToAppleWallet")
      : Alert.alert("This feature is for iOS only");
    // @TODO: Android
  };

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  return (
    <Page>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <BackgrounTopStartSvg style={styles.backgroundTopStart} />
      <BackgroundBottomSvg style={styles.backgroundBottom} />
      <NavHeader withBackButton={false} end="close" />
      <ContentContainer>
        <Stack direction="vertical" gap="16p" align="center">
          <View style={styles.iconContainer}>
            <ShippingIcon />
          </View>
          <Typography.Text size="large" weight="bold" color="primaryBase-10">
            {t("ApplyCards.CardOrderedScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" color="primaryBase-10">
            {t("ApplyCards.CardOrderedScreen.paragraph")} &lt;deliveryDate&gt;
          </Typography.Text>
        </Stack>
        <View style={styles.buttons}>
          <Stack align="stretch" direction="vertical" gap="8p">
            <Button variant="primary" block onPress={handleOnAddToWallet}>
              {t("ApplyCards.CardOrderedScreen.buttons.addToWallet")}
            </Button>
            <Button variant="tertiary" onPress={handleOnClose}>
              {t("ApplyCards.CardOrderedScreen.buttons.finish")}
            </Button>
          </Stack>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundBottom: {
    bottom: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  backgroundTopStart: {
    position: "absolute",
    start: 0,
    top: 0,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  buttons: {
    marginTop: "auto",
  },
  iconContainer: {
    paddingBottom: 35,
    paddingTop: 146,
  },
});
