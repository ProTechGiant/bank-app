import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import HeroSlider from "@/components/HeroSlider";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function CardActivatedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.HomeScreen");
  };

  const topElementStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 40,
    height: 80,
    width: 80,
  }));

  return (
    <HeroSlider
      buttonText=""
      data={[
        {
          topElement: <View style={topElementStyle} />,
          title: t("CardActions.ActivationScreen.successMessage"),
          text: t("CardActions.ActivationScreen.successDescription"),
        },
      ]}
      lastButtonText={t("CardActions.ActivationScreen.button")}
      onFinishPress={handleOnFinish}
      end={<CloseEndButton onPress={handleOnFinish} color="errorBase" />}
      hasBackButton={false}
    />
  );
}
