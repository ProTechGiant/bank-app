import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import HeroSlider from "@/components/HeroSlider";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import PlaceholderCardSvg from "./placeholder-card.svg";

export default function SingleUseCardInfo() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnGenerateCard = () => {
    navigation.navigate("CardActions.OneTimePasswordModal", {
      redirect: "CardActions.LoadingSingleCardScreen",
      action: "generate-single-use-card",
    });
  };

  const shadowStyle = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.06,
    elevation: 5,
  }));

  return (
    <HeroSlider
      buttonText={t("CardActions.SingleUseCardsInfo.generateButton")}
      data={[
        {
          topElement: (
            <View style={shadowStyle}>
              <PlaceholderCardSvg />
            </View>
          ),
          title: t("CardActions.SingleUseCardsInfo.title"),
          text: t("CardActions.SingleUseCardsInfo.text"),
        },
      ]}
      lastButtonText={t("CardActions.SingleUseCardsInfo.generateButton")}
      onFinishPress={handleOnGenerateCard}
    />
  );
}
