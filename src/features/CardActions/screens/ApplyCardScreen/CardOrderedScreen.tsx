import * as React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import HeroSlider from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { MadaPayBanner } from "../../components";
import useAppleWallet from "../../hooks/use-apple-wallet";

interface CardOrderedScreenProps {
  cardId: string;
}

export default function CardOrderedScreen({ cardId }: CardOrderedScreenProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isAppleWalletAvailable, canAddCardToAppleWallet, addCardToAppleWallet } = useAppleWallet(cardId);

  const handleOnAddToWallet = async () => {
    try {
      const _response = await addCardToAppleWallet();
      navigation.navigate("CardActions.CardDetailsScreen", { cardId });
    } catch (error) {
      warn("card-actions", `Could not add card "${cardId}" to Apple Wallet: `, JSON.stringify(error));
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
          title: t("CardActions.ApplyCardScreen.CardOrderedScreen.title"),
          text: t("CardActions.ApplyCardScreen.CardOrderedScreen.paragraph"),
        },
      ]}
      hasBackButton={false}
      onFinishPress={handleOnClose}
      end={<NavHeader.CloseEndButton onPress={handleOnClose} />}>
      {isAppleWalletAvailable && canAddCardToAppleWallet ? (
        <AddToAppleWalletButton onPress={handleOnAddToWallet} />
      ) : null}
      {Platform.OS === "android" ? (
        <View style={styles.madaPayContainer}>
          <MadaPayBanner />
        </View>
      ) : null}
      <Button
        variant={!isAppleWalletAvailable || !canAddCardToAppleWallet ? "primary" : "tertiary"}
        onPress={handleOnClose}>
        {t("CardActions.ApplyCardScreen.CardOrderedScreen.finishButton")}
      </Button>
    </HeroSlider>
  );
}

const styles = StyleSheet.create({
  madaPayContainer: { marginVertical: 20 },
});
