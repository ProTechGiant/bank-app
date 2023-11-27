import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import { MutualFundIllustrationIcon } from "../assets/icons";

export default function MutualFundEntryPointScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const svgHeight = height * 0.5;
  const svgWidth = svgHeight * 0.8;
  const svgStyles = { top: height * 0.52 };

  const handleOnFinish = () => {
    navigation.navigate("MutualFund.MutualFundOnboardingScreen");
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
      <MutualFundIllustrationIcon height={svgHeight} width={svgWidth} />,
      t(`MutualFund.MutualFundEntryPointScreen.title`),
      ""
    ),
  ];
  // In AC there is several possibilities when click on mutual fund shortcut
  // so in this section I'm redirect to different pages depending on different scenarios

  return (
    <HeroSlider
      variant="default"
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={
        <NavHeader.TextEndButton
          onPress={handleOnFinish}
          text={t(`Home.DashboardScreen.GoalGetter.landingScreen.skip`)}
        />
      }
      buttonText=""
      lastButtonText={t(`MutualFund.MutualFundEntryPointScreen.button`)}
      data={data}
      title={t(`MutualFund.MutualFundEntryPointScreen.headerTitle`)}
      testID="MutualFund.EntryPoint-TermsAndConditions:HeroSlider"
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
