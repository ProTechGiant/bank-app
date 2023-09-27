import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import LandingGoalGetter from "../assets/icons/LandingGoalGetter";

export default function GoalGetterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const svgHeight = height * 0.5;
  const svgWidth = svgHeight * 0.8;
  const svgStyles = { top: height * 0.52 };

  const handleOnFinish = () => {
    navigation.navigate("GoalGetter.GoalMindScreen");
  };

  const handleOnBack = () => {
    navigation.goBack();
  };

  const createHeroSlide = (topElement: ReactNode, title: string, text: string) => {
    return {
      topElement: <View style={styles.topElementStyle}>{topElement}</View>,
      title: title,
      text: text,
      containerStyle: styles.containerStyle,
      bottomElementStyle: [styles.bottomElementStyle, svgStyles],
    };
  };

  const data: HeroSlideProps[] = [
    createHeroSlide(
      <LandingGoalGetter height={svgHeight} width={svgWidth} />,
      t("GoalGetter.landingScreen.titleOne"),
      t("GoalGetter.landingScreen.subTextOne")
    ),
    createHeroSlide(
      <LandingGoalGetter height={svgHeight} width={svgWidth} />,
      t("GoalGetter.landingScreen.titleTwo"),
      t("GoalGetter.landingScreen.subTextTwo")
    ),
    createHeroSlide(
      <LandingGoalGetter height={svgHeight} width={svgWidth} />,
      t("GoalGetter.landingScreen.titleThree"),
      t("GoalGetter.landingScreen.subTextThree")
    ),
    createHeroSlide(
      <LandingGoalGetter height={svgHeight} width={svgWidth} />,
      t("GoalGetter.landingScreen.titleFour"),
      t("GoalGetter.landingScreen.subTextFour")
    ),
  ];

  return (
    <HeroSlider
      variant="default"
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`GoalGetter.landingScreen.skip`)} />}
      buttonText={t("GoalGetter.landingScreen.next")}
      lastButtonText={t("GoalGetter.landingScreen.createGoal")}
      data={data}
      title={t("GoalGetter.landingScreen.title")}
    />
  );
}
const styles = StyleSheet.create({
  bottomElementStyle: {
    position: "absolute",
    width: "100%",
  },
  containerStyle: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },
  topElementStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});
