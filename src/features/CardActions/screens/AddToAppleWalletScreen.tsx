import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import AddToAppleWalletButton from "@/components/AddToAppleWalletButton/AddToAppleWalletButton";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../CardActionsStack";
import { CardPlaceholder } from "../components";
import { useCard } from "../hooks/query-hooks";
import useTokenizedCard from "../hooks/use-tokenized-card";

export default function AddToAppleWalletScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.AddToAppleWallet">>();

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
  const card = useCard(route.params.cardId);

  const handleOnSkip = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnAddToWallet = async () => {
    const cardId = card.data.cardId;

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
        {card.data !== undefined ? (
          <CardPlaceholder
            variant={card.data.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "lux"}
            width="100%"
          />
        ) : null}
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
