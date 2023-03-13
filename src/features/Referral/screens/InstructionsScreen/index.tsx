import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { GiftIcon, InviteIcon, ReferralsIcon } from "@/assets/icons";
import HeroSlider from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function InstructionsScreen() {
  const { setReferralPageViewed } = useGlobalContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    setReferralPageViewed(true);
  }, []);

  const handleOnFinish = () => {
    navigation.goBack();
  };

  const handleOnBack = () => {
    // Navigated from first instance on referral hub but going back we want the page before this
    navigation.goBack();
    navigation.goBack();
  };

  const iconWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      width: 64,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32,
    }),
    []
  );

  const { height: iconHeight, width: iconWidth } = useThemeStyles(theme => theme.iconDimensions.referralInstruction);

  const data: HeroSlideProps[] = [
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <InviteIcon width={iconWidth} height={iconHeight} />
        </View>
      ),
      title: t("Referral.InstructionsScreen.titleOne"),
      text: t("Referral.InstructionsScreen.subTextOne"),
    },
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <ReferralsIcon width={iconWidth} height={iconHeight} />
        </View>
      ),
      title: t("Referral.InstructionsScreen.titleTwo"),
      text: t("Referral.InstructionsScreen.subTextTwo"),
    },
    {
      topElement: (
        <View style={iconWrapperStyle}>
          <GiftIcon width={iconWidth} height={iconHeight} />
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
