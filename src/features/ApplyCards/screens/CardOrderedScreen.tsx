import * as React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function CardOrderedScreen() {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flex: 1,
      justifyContent: "space-around",
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );

  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      justifyContent: "center",
      paddingTop: 80,
      paddingBottom: theme.spacing.large,
    }),
    []
  );

  const textContainerStyle = useThemeStyles<TextStyle>(
    theme => ({
      alignItems: "center",
      height: "30%",
      padding: theme.spacing.small,
    }),
    []
  );
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.medium,
    }),
    []
  );

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
        <View style={containerStyle}>
          <View style={iconContainerStyle}>
            <ShippingIcon />
          </View>
          <View style={textContainerStyle}>
            <View style={titleStyle}>
              <Typography.Text size="large" weight="bold" color="neutralBase-50">
                {t("ApplyCards.CardOrderedScreen.title")}
              </Typography.Text>
            </View>
            <Typography.Text size="callout" color="neutralBase-50">
              {t("ApplyCards.CardOrderedScreen.paragraph")} &lt;deliveryDate&gt;
            </Typography.Text>
          </View>
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
        </View>
      </Page>
    </DarkOneGradient>
  );
}

const styles = StyleSheet.create({
  buttons: {
    height: "40%",
    justifyContent: "flex-end",
    width: "100%",
  },
});
