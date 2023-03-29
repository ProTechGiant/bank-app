import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { ShippingIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import HeroSlider from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { CardActionsStackParams } from "../../CardActionsStack";
import useAppleWallet from "../../hooks/use-apple-wallet";

export default function CardOrderedScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardOrderedScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { isAppleWalletAvailable, canAddCardToAppleWallet, addCardToAppleWallet } = useAppleWallet(route.params.cardId);

  const handleOnAddToWallet = async () => {
    try {
      const _response = await addCardToAppleWallet();

      navigation.navigate("CardActions.CardDetailsScreen", {
        cardId: route.params.cardId,
      });
    } catch (error) {
      warn("card-actions", `Could not add card "${route.params.cardId}" to Apple Wallet: `, JSON.stringify(error));
    }
  };

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  return (
    <HeroSlider
      buttonText=""
      lastButtonText=""
      data={[
        {
          topElement: <ShippingIcon />,
          title: t("ApplyCards.CardOrderedScreen.title"),
          text: t("ApplyCards.CardOrderedScreen.paragraph"),
        },
      ]}
      hasBackButton={false}
      onFinishPress={handleOnClose}
      end={<NavHeader.CloseEndButton onPress={handleOnClose} />}>
      {isAppleWalletAvailable && canAddCardToAppleWallet ? (
        <AddToAppleWalletButton onPress={handleOnAddToWallet} />
      ) : null}
      <Button
        variant={!isAppleWalletAvailable || !canAddCardToAppleWallet ? "primary" : "tertiary"}
        onPress={handleOnClose}>
        {t("ApplyCards.CardOrderedScreen.finishButton")}
      </Button>
    </HeroSlider>
  );
}
