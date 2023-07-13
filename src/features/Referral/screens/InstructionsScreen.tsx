import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import HeroSlider from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import { useReferralContext } from "@/contexts/ReferralContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ReferralsBullhorn from "../assets/ReferralsBullhorn";
import ReferralsGift from "../assets/ReferralsGift";
import ReferralsInvite from "../assets/ReferralsInvite";

export default function InstructionsScreen() {
  const { setReferralPageViewStatus } = useReferralContext();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed
  const svgStyles = { top: height * 0.52 };

  useEffect(() => {
    setReferralPageViewStatus("in-progress");
  }, []);

  const handleOnFinish = () => {
    navigation.goBack();
    setReferralPageViewStatus("finished");
  };

  const handleOnBack = () => {
    // Navigated from first instance on referral hub but going back we want the page before this
    navigation.goBack();
    navigation.goBack();
    setReferralPageViewStatus("finished");
  };

  const topElementStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    marginTop: -theme.spacing["24p"],
  }));

  const bottomElementStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["24p"],
    position: "absolute",
    width: "100%",
  }));

  const createHeroSlide = (topElement: ReactNode, title: string, text: string) => {
    return {
      topElement: <View style={topElementStyle}>{topElement}</View>,
      title: title,
      text: text,
      containerStyle: styles.containerStyle,
      bottomElementStyle: [bottomElementStyle, svgStyles],
    };
  };

  const data: HeroSlideProps[] = [
    createHeroSlide(
      <ReferralsInvite height={svgHeight} width={svgWidth} />,
      t("Referral.InstructionsScreen.titleOne"),
      t("Referral.InstructionsScreen.subTextOne")
    ),
    createHeroSlide(
      <ReferralsBullhorn height={svgHeight} width={svgWidth} />,
      t("Referral.InstructionsScreen.titleTwo"),
      t("Referral.InstructionsScreen.subTextTwo")
    ),
    createHeroSlide(
      <ReferralsGift height={svgHeight} width={svgWidth} />,
      t("Referral.InstructionsScreen.titleThree"),
      t("Referral.InstructionsScreen.subTextThree")
    ),
  ];

  return (
    <HeroSlider
      variant="default"
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`Referral.InstructionsScreen.skip`)} />}
      buttonText={t("Referral.InstructionsScreen.continue")}
      lastButtonText={t("Referral.InstructionsScreen.done")}
      data={data}
    />
  );
}
const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },
});
