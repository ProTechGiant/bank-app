import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import AddToAppleWalletButton from "@/components/AddToAppleWalletButton/AddToAppleWalletButton";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardPlaceholder } from "../components";
import { useTokenizedCard } from "../hooks/query-hooks";

export default function AddToAppleWalletScreen() {
  const contentContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["16p"],
    }),
    []
  );
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: 42,
      marginBottom: theme.spacing["16p"],
    }),
    []
  );
  const introStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing["24p"],
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
      warn("apply-cards", "Could fetch card token!"); //@TODO: display error message
    }
  };

  return (
    <Page>
      <NavHeader withBackButton={false} end="close" />
      <ContentContainer style={contentContainerStyle}>
        <View style={titleStyle}>
          <Typography.Text size="large" weight="bold">
            {t("ApplyCards.AddToAppleWalletScreen.title")}
          </Typography.Text>
        </View>
        <View style={introStyle}>
          <Typography.Text size="callout">{t("ApplyCards.AddToAppleWalletScreen.paragraph")}</Typography.Text>
        </View>
        <CardPlaceholder variant="standard" width="100%" />

        <View style={styles.buttons}>
          <AddToAppleWalletButton onPress={handleOnAddToWallet} />
          <Button variant="tertiary" onPress={handleOnSkip}>
            <Typography.Text color="neutralBase+30">
              {t("ApplyCards.AddToAppleWalletScreen.buttons.skip")}
            </Typography.Text>
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
