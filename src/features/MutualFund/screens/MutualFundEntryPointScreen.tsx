import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { HeroSlider } from "@/components/HeroSlider";
import { HeroSlideProps } from "@/components/HeroSlider/HeroSlide";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

import { MutualFundIllustrationIcon } from "../assets/icons";
import { usePortfolioDetails, usePortfoliosPerformanceList } from "../hooks/query-hooks";
import { ENTRY_POINT } from "../mocks/entryPoint";

export default function MutualFundEntryPointScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const { data: PortfoliosPerformanceList } = usePortfoliosPerformanceList();
  const { data: PortfolioDetails } = usePortfolioDetails();

  const svgHeight = height * 0.5;
  const svgWidth = svgHeight * 0.8;
  const svgStyles = { top: height * 0.52 };

  const handleOnFinish = () => {
    navigation.navigate("MutualFund.DiscoverProducts");
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
      t(`MutualFund.MutualFundEntryPointScreen.description`)
    ),
  ];
  // In AC there is several possibilities when click on mutual fund shortcut
  // so in this section I'm redirect to different pages depending on different scenarios
  useEffect(() => {
    if (PortfoliosPerformanceList !== undefined) {
      if (ENTRY_POINT.onboardedARCStatus) {
        if (PortfoliosPerformanceList?.PortfoliosPerformanceList.length === 0) {
          navigation.navigate("MutualFund.DiscoverProducts");
        } else if (PortfoliosPerformanceList?.PortfoliosPerformanceList.length === 1) {
          navigation.navigate("MutualFund.PortfolioDetails", {
            PortfolioPerformanceLineChartColorIndex: 0,
            PortfolioPerformanceList: { PortfolioPerformanceList: PortfolioDetails?.PortfolioPerformanceList },
            PortfolioPerformanceName: PortfolioDetails?.PortfolioName,
          });
        } else {
          navigation.navigate("MutualFund.Dashboard");
        }
      } else {
        // TODO: navigate to onboarding journey page which will be build in BC13.
      }
    }
  }, [PortfoliosPerformanceList, navigation, PortfolioDetails]);

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
