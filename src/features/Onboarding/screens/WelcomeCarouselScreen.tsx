import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";

import { createBrandHeroSlide, HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import WelcomeCarouselFour from "../assets/WelcomeCarouselFour";
import WelcomeCarouselOne from "../assets/WelcomeCarouselOne";
import WelcomeCarouselThree from "../assets/WelcomeCarouselThree";
import WelcomeCarouselTwo from "../assets/WelcomeCarouselTwo";

export default function WelcomeCarouselScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();

  const handleOnFinish = async () => {
    await setItemInEncryptedStorage("hasSeenOnboarding", JSON.stringify(true));
    navigation.navigate("Onboarding.OnboardingStack", { screen: "Onboarding.SplashScreen" });
  };

  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed
  const svgStyles = { top: height * 0.45 };

  const data: HeroSlideProps[] = [
    createBrandHeroSlide(
      <WelcomeCarouselOne height={svgHeight} width={svgWidth} />,
      t("Onboarding.WelcomeCarousel.titleOne"),
      t("Onboarding.WelcomeCarousel.subTextOne"),
      undefined,
      svgStyles
    ),
    createBrandHeroSlide(
      <WelcomeCarouselTwo height={svgHeight} width={svgWidth} />,
      t("Onboarding.WelcomeCarousel.titleTwo"),
      t("Onboarding.WelcomeCarousel.subTextTwo"),
      undefined,
      svgStyles
    ),
    createBrandHeroSlide(
      <WelcomeCarouselThree height={svgHeight} width={svgWidth} />,
      t("Onboarding.WelcomeCarousel.titleThree"),
      t("Onboarding.WelcomeCarousel.subTextThree"),
      undefined,
      svgStyles
    ),
    createBrandHeroSlide(
      <WelcomeCarouselFour height={svgHeight} width={svgWidth} />,
      t("Onboarding.WelcomeCarousel.titleFour"),
      t("Onboarding.WelcomeCarousel.subTextFour"),
      undefined,
      svgStyles
    ),
  ];

  return (
    <HeroSlider
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      end={<NavHeader.TextEndButton onPress={handleOnFinish} text={t(`Referral.InstructionsScreen.skip`)} />}
      buttonText={t("Onboarding.WelcomeCarousel.nextButton")}
      lastButtonText={t("Onboarding.WelcomeCarousel.nextButton")}
      data={data}
      variant="default"
      testID="Onboarding.WelcomeCarouselScreen:NextButton"
      darkTheme={true}
    />
  );
}
