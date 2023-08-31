import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";

import { createBrandHeroSlide, HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import SavingsInstructionsOne from "../assets/SavingsInstructionsOne";
import SavingsInstructionsThree from "../assets/SavingsInstructionsThree";
import SavingsInstructionsTwo from "../assets/SavingsInstructionsTwo";

export default function InstructionsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const handleOnFinish = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  const handleOnBack = () => {
    navigation.goBack();
  };

  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed
  const textPositionStyles = { top: height * 0.42 };

  const svgPositionStyles = { bottom: height * 0.05 };

  const data: HeroSlideProps[] = [
    createBrandHeroSlide(
      <SavingsInstructionsOne height={svgHeight} width={svgWidth} />,
      t("SavingsGoals.InstructionsScreen.titleOne"),
      t("SavingsGoals.InstructionsScreen.subTextOne"),
      svgPositionStyles,
      textPositionStyles
    ),
    createBrandHeroSlide(
      <SavingsInstructionsTwo height={svgHeight} width={svgWidth} />,
      t("SavingsGoals.InstructionsScreen.titleTwo"),
      t("SavingsGoals.InstructionsScreen.subTextTwo"),
      svgPositionStyles,
      textPositionStyles
    ),
    createBrandHeroSlide(
      <SavingsInstructionsThree height={svgHeight} width={svgWidth} />,
      t("SavingsGoals.InstructionsScreen.titleThree"),
      t("SavingsGoals.InstructionsScreen.subTextThree"),
      svgPositionStyles,
      textPositionStyles
    ),
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`SavingsGoals.InstructionsScreen.skip`)} />}
      buttonText={t("SavingsGoals.InstructionsScreen.nextButton")}
      lastButtonText={t("SavingsGoals.InstructionsScreen.setGoalButton")}
      data={data}
      variant="default"
      testID="SavinsGoals.InstructionsScreen:NextButton"
    />
  );
}
