import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";

import { createBrandHeroSlide, HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import { FreeMusicIcon, FreeStreamingIcon, FreeSubscriptionIcon } from "../../assets/icons";

export default function WelcomeBenefitsScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.BenefitsScreen" });
  };
  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed
  const svgStyles = { top: height * 0.52 };

  const data: HeroSlideProps[] = [
    createBrandHeroSlide(
      <FreeSubscriptionIcon height={svgHeight} width={svgWidth} />,
      t("AllInOneCard.WelcomeCarousel.titleOne"),
      t("AllInOneCard.WelcomeCarousel.subTextOne"),
      undefined,
      svgStyles
    ),
    createBrandHeroSlide(
      <FreeStreamingIcon height={svgHeight} width={svgWidth} />,
      t("AllInOneCard.WelcomeCarousel.titleTwo"),
      t("AllInOneCard.WelcomeCarousel.subTextTwo"),
      undefined,
      svgStyles
    ),
    createBrandHeroSlide(
      <FreeMusicIcon height={svgHeight} width={svgWidth} />,
      t("AllInOneCard.WelcomeCarousel.titleThree"),
      t("AllInOneCard.WelcomeCarousel.subTextThree"),
      undefined,
      svgStyles
    ),
  ];

  return (
    <HeroSlider
      variant="default"
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      end={<NavHeader.CloseEndButton onPress={handleOnFinish} />}
      buttonText={t("AllInOneCard.WelcomeCarousel.nextButton")}
      lastButtonText={t("AllInOneCard.WelcomeCarousel.nextButton")}
      data={data}
    />
  );
}
