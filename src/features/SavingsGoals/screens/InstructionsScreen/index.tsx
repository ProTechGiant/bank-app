import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import BrandBanner from "./BrandBanner";

export default function InstructionsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  const handleOnBack = () => {
    navigation.goBack();
  };

  const data: HeroSlideProps[] = [
    {
      topElement: <BrandBanner title="Brand Moment" />,
      title: t("SavingsGoals.InstructionsScreen.titleOne"),
      subText: t("SavingsGoals.InstructionsScreen.subTextOne"),
    },
    {
      topElement: <BrandBanner title="Brand Moment" />,
      title: t("SavingsGoals.InstructionsScreen.titleTwo"),
      subText: t("SavingsGoals.InstructionsScreen.subTextTwo"),
    },
    {
      topElement: <BrandBanner title="Brand Moment" />,
      title: t("SavingsGoals.InstructionsScreen.titleThree"),
      subText: t("SavingsGoals.InstructionsScreen.subTextThree"),
    },
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`SavingsGoals.InstructionsScreen.skip`)} />}
      buttonText={t("SavingsGoals.InstructionsScreen.continueButton")}
      lastButtonText={t("SavingsGoals.InstructionsScreen.createGoalButton")}
      data={data}
    />
  );
}
