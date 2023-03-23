import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import AddToAppleWalletButton from "@/components/AddToAppleWalletButton/AddToAppleWalletButton";
import CloseEndButton from "@/components/Banner/CloseEndButton";
import Button from "@/components/Button";
import HeroSlider from "@/components/HeroSlider";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

export default function ReportCardSuccessScreen() {
  const route = useRoute<RouteProp<MainStackParams, "CardActions.ReportCardSuccessScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId: route.params.cardId });
  };

  const handleOnAddToWallet = () => {
    navigation.navigate("Temporary.DummyScreen");
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
      end={<CloseEndButton onPress={handleOnFinish} color="errorBase" />}
      hasBackButton={false}
      children={
        <View>
          <AddToAppleWalletButton onPress={handleOnAddToWallet} />

          <Button variant="tertiary" onPress={handleOnFinish}>
            {t("CardActions.ReportCardScreen.ConfirmationScreen.okBtn")}
          </Button>
        </View>
      }
    />
  );
}
