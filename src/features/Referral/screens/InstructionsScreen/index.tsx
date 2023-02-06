import times from "lodash/times";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import SlideView from "@/components/SlideView";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import IntroductionSlide from "./IntroductionSlide";

export default function InstructionsScreen() {
  const { setReferralPageViewed } = useGlobalContext();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const totalStep = 3;

  useEffect(() => {
    setReferralPageViewed(true);
  }, []);

  const handleOnfinish = () => {
    navigation.goBack();
  };

  const handleOnBack = () => {
    // Navigated from first instance on referral hub but going back we want the page before this
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <SlideView
      onFinishPress={handleOnfinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnfinish} text={t(`Referral.InstructionsScreen.skip`)} />}
      buttonText={t("Referral.InstructionsScreen.continue")}
      lastButtonText={t("Referral.InstructionsScreen.done")}>
      {times(totalStep, i => (
        <IntroductionSlide key={i} step={i + 1} />
      ))}
    </SlideView>
  );
}
