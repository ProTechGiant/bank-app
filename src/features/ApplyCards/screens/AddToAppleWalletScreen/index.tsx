import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import BankCard from "@/components/BankCard";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import useTokenizedCard from "./use-tokenized-card";

export default function AddToAppleWalletScreen() {
  const contentContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: 42,
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const introStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.large,
    }),
    []
  );

  const navigation = useNavigation();
  const { t } = useTranslation();
  const getTokenized = useTokenizedCard(); // temp value

  const handleOnSkip = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnAddToWallet = async () => {
    const cardId = "335688998"; // Temp card ID

    try {
      const response = await getTokenized.mutateAsync(cardId);
      JSON.stringify(response); //@TODO: use secret ID for apple pay
    } catch (error) {
      console.log(JSON.stringify(error)); //@TODO: display error message
    }
  };

  return (
    <Page>
      <NavHeader title="" backButton={false} />
      <ContentContainer style={contentContainerStyle}>
        <View style={titleStyle}>
          <Typography.Text size="large" weight="bold">
            {t("ApplyCards.AddToAppleWalletScreen.title")}
          </Typography.Text>
        </View>
        <View style={introStyle}>
          <Typography.Text size="callout">{t("ApplyCards.AddToAppleWalletScreen.paragraph")}</Typography.Text>
        </View>
        <BankCard variant="standard" width="100%" />

        <View style={styles.buttons}>
          <Button block onPress={handleOnAddToWallet}>
            {t("ApplyCards.AddToAppleWalletScreen.buttons.addToWallet")}
          </Button>
          <Button variant="tertiary" onPress={handleOnSkip}>
            <Typography.Text color="tintBase+20">{t("ApplyCards.AddToAppleWalletScreen.buttons.skip")}</Typography.Text>
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: "auto",
  },
});
