import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import HeroSlider from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import useAppleWallet from "../../hooks/use-apple-wallet";

export default function ReportCardSuccessScreen() {
  const route = useRoute<RouteProp<MainStackParams, "CardActions.ReportCardSuccessScreen">>();
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

  const handleOnFinish = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId: route.params.cardId });
  };

  return (
    <HeroSlider
      buttonText=""
      data={[
        {
          topElement: <View style={{ backgroundColor: "#F34C33", borderRadius: 40, height: 80, width: 80 }} />,
          title: t("CardActions.ReportCardScreen.ConfirmationScreen.title"),
          text: t("CardActions.ReportCardScreen.ConfirmationScreen.description"),
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      end={<NavHeader.CloseEndButton onPress={handleOnFinish} />}
      hasBackButton={false}>
      {isAppleWalletAvailable && canAddCardToAppleWallet ? (
        <AddToAppleWalletButton onPress={handleOnAddToWallet} />
      ) : null}
      <Button
        variant={!isAppleWalletAvailable || !canAddCardToAppleWallet ? "primary" : "tertiary"}
        onPress={handleOnFinish}>
        {t("ApplyCards.CardOrderedScreen.finishButton")}
      </Button>
    </HeroSlider>
  );
}
