import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { GiftIcon, InviteIcon, ReferralsIcon } from "@/assets/icons";
import HeroSlider from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import { useReferralContext } from "@/contexts/ReferralContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function InstructionsScreen() {
  const { setReferralPageViewStatus } = useReferralContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

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

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
  }));

  const data: HeroSlideProps[] = [
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <InviteIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
        </View>
      ),
      title: t("Referral.InstructionsScreen.titleOne"),
      text: t("Referral.InstructionsScreen.subTextOne"),
    },
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <ReferralsIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
        </View>
      ),
      title: t("Referral.InstructionsScreen.titleTwo"),
      text: t("Referral.InstructionsScreen.subTextTwo"),
    },
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <GiftIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
        </View>
      ),
      title: t("Referral.InstructionsScreen.titleThree"),
      text: t("Referral.InstructionsScreen.subTextThree"),
    },
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnFinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`Referral.InstructionsScreen.skip`)} />}
      buttonText={t("Referral.InstructionsScreen.continue")}
      lastButtonText={t("Referral.InstructionsScreen.done")}
      data={data}
    />
  );
}

const ICON_WIDTH = 51;
const ICON_HEIGHT = 37;
