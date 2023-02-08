import times from "lodash/times";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GiftIcon, InviteIcon, ReferraslIcon } from "@/assets/icons";
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

  const handleOnfinish = () => {
    navigation.goBack();
  };

  const handleOnBack = () => {
    // Navigated from first instance on referral hub but going back we want the page before this
    navigation.goBack();
    navigation.goBack();
  };
  const { height: iconHeight, width: iconWidth } = useThemeStyles(theme => theme.iconDimensions.referralInstruction);

  const data: HeroSlideProps[] = [
    {
      topElement: <InviteIcon width={iconWidth} height={iconHeight} />,
      title: t("Referral.InstructionsScreen.titleOne"),
      subText: t("Referral.InstructionsScreen.subTextOne"),
    },
    {
      topElement: <ReferraslIcon width={iconWidth} height={iconHeight} />,
      title: t("Referral.InstructionsScreen.titleTwo"),
      subText: t("Referral.InstructionsScreen.subTextTwo"),
    },
    {
      topElement: <GiftIcon width={iconWidth} height={iconHeight} />,
      title: t("Referral.InstructionsScreen.titleThree"),
      subText: t("Referral.InstructionsScreen.subTextThree"),
    },
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnfinish}
      onBackPress={handleOnBack}
      end={<NavHeader.TextEndButton onPress={handleOnfinish} text={t(`Referral.InstructionsScreen.skip`)} />}
      buttonText={t("Referral.InstructionsScreen.continue")}
      lastButtonText={t("Referral.InstructionsScreen.done")}
      data={data}
    />
  );
}
