import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import HeroSlide from "@/components/HeroSlider/HeroSlide";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import BrandBanner from "@/features/SavingsGoals/screens/InstructionsScreen/BrandBanner";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SingleUseCardInfo() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const mainViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    flex: 1,
    justifyContent: "space-between",
  }));

  const contentViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    flex: 1,
  }));

  const handleOnGenerateCard = () => {
    navigation.navigate("CardActions.OneTimePasswordModal", {
      redirect: "CardActions.LoadingSingleCardScreen",
      action: "generate-single-use-card",
    });
  };

  return (
    <DarkOneGradient>
      <Page>
        <NavHeader withBackButton color="white" />
        <View style={mainViewStyle}>
          <View style={contentViewStyle}>
            <HeroSlide
              key={0}
              topElement={<BrandBanner title="Brand Moment" />}
              title={t("Cards.SingleUseCard.InfoScreen.title")}
              subText={t("Cards.SingleUseCard.InfoScreen.subTitle")}
            />
          </View>
          <Button variant="primary" color="dark" onPress={handleOnGenerateCard}>
            {t("Cards.SingleUseCard.InfoScreen.generateBtn")}
          </Button>
        </View>
      </Page>
    </DarkOneGradient>
  );
}
