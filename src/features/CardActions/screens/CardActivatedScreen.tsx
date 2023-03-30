import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import HeroSlider from "@/components/HeroSlider";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

export default function CardActivatedScreen() {
  const route = useRoute<RouteProp<MainStackParams, "CardActions.CardActivatedScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId: route.params.cardId });
  };

  return (
    <HeroSlider
      buttonText=""
      data={[
        {
          topElement: <View style={{ backgroundColor: "#F34C33", borderRadius: 40, height: 80, width: 80 }} />,
          title: t("CardActions.ActivationScreen.successMessage"),
          text: t("CardActions.ActivationScreen.successDescription"),
        },
      ]}
      lastButtonText={t("CardActions.ActivationScreen.okBtn")}
      onFinishPress={handleOnFinish}
      end={<CloseEndButton onPress={handleOnFinish} color="errorBase" />}
      hasBackButton={false}
    />
  );
}
