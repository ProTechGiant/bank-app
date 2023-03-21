import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import HeroSlider from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

function PlaceholderDot() {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 40,
    height: 80,
    width: 80,
  }));

  return <View style={containerStyle} />;
}

export default function InstructionsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("SavingsGoals.ListGoalsScreen");
  };

  const handleOnBack = () => {
    navigation.goBack();
  };

  const data: HeroSlideProps[] = [
    {
      topElement: <PlaceholderDot />,
      title: t("SavingsGoals.InstructionsScreen.titleOne"),
      text: t("SavingsGoals.InstructionsScreen.subTextOne"),
    },
    {
      topElement: <PlaceholderDot />,
      title: t("SavingsGoals.InstructionsScreen.titleTwo"),
      text: t("SavingsGoals.InstructionsScreen.subTextTwo"),
    },
    {
      topElement: <PlaceholderDot />,
      title: t("SavingsGoals.InstructionsScreen.titleThree"),
      text: t("SavingsGoals.InstructionsScreen.subTextThree"),
    },
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`SavingsGoals.InstructionsScreen.skip`)} />}
      buttonText={t("SavingsGoals.InstructionsScreen.nextButton")}
      lastButtonText={t("SavingsGoals.InstructionsScreen.setGoalButton")}
      data={data}
    />
  );
}
