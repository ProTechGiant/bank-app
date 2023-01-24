import * as React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

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
    <DarkOneGradient>
      <Page>
        <NavHeader title="" backButton={false} color="white" />
        <ContentContainer>
          <Stack direction="vertical" gap="medium" align="center">
            <View style={styles.iconContainer}>
              <ShippingIcon />
            </View>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              {t("ApplyCards.CardOrderedScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase-50">
              {t("ApplyCards.CardOrderedScreen.paragraph")} &lt;deliveryDate&gt;
            </Typography.Text>
          </Stack>
          <View style={styles.buttons}>
            <Button color="alt" block onPress={handleOnAddToWallet}>
              {t("ApplyCards.CardOrderedScreen.buttons.addToWallet")}
            </Button>
            <Button variant="tertiary" onPress={handleOnClose}>
              <Typography.Text color="neutralBase-50">
                {t("ApplyCards.CardOrderedScreen.buttons.finish")}
              </Typography.Text>
            </Button>
          </View>
        </ContentContainer>
      </Page>
    </DarkOneGradient>
  );
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: "auto",
  },
  iconContainer: {
    paddingBottom: 35,
    paddingTop: 60,
  },
});
